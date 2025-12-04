import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Difficulty, MathProblem, TopicId } from "../types";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const problemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The math question text. Use LaTeX formatted with single $ for inline math (e.g. $x^2$) and double $$ for block math.",
    },
    type: {
      type: Type.STRING,
      enum: ["MULTIPLE_CHOICE", "SHORT_ANSWER"],
      description: "The type of question.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of 4 options if type is MULTIPLE_CHOICE. Null if SHORT_ANSWER.",
    },
    correctAnswer: {
      type: Type.STRING,
      description: "The correct answer string. For multiple choice, must match one of the options exactly.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed step-by-step explanation of the solution in Vietnamese, using LaTeX for math formulas.",
    },
    hint: {
      type: Type.STRING,
      description: "A helpful hint without giving away the answer in Vietnamese.",
    }
  },
  required: ["question", "type", "correctAnswer", "explanation", "hint"],
};

export const generateProblem = async (topic: TopicId, difficulty: Difficulty): Promise<MathProblem> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    Bạn là một giáo viên toán học xuất sắc. Hãy tạo một bài toán toán học bằng Tiếng Việt.
    
    Chủ đề: ${topic}
    Độ khó: ${difficulty}
    
    Yêu cầu:
    1. Câu hỏi phải rõ ràng, thú vị.
    2. Sử dụng định dạng LaTeX cho các công thức toán học (ví dụ: $x^2 + 2x + 1 = 0$).
    3. Nếu là trắc nghiệm, hãy đưa ra 4 lựa chọn, chỉ có 1 đáp án đúng.
    4. Giải thích chi tiết từng bước.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: problemSchema,
        temperature: 0.7, // Balance between creativity and correctness
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as MathProblem;
  } catch (error) {
    console.error("Error generating problem:", error);
    // Fallback problem in case of error
    return {
      question: "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại. Bạn có thể tính $1 + 1$ không?",
      type: "SHORT_ANSWER",
      correctAnswer: "2",
      explanation: "Đây là bài toán dự phòng. $1 + 1 = 2$.",
      hint: "Số liền sau số 1"
    };
  }
};
