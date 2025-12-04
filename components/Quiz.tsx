import React, { useState, useEffect, useCallback } from 'react';
import { Topic, Difficulty, QuizState, TopicId } from '../types';
import { generateProblem } from '../services/geminiService';
import MathDisplay from './MathDisplay';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, RefreshCw, Trophy, Send, ArrowRight } from 'lucide-react';

interface QuizProps {
  topic: Topic;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ topic, onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [state, setState] = useState<QuizState>({
    currentProblem: null,
    loading: true,
    answered: false,
    isCorrect: false,
    selectedOption: null,
    textInput: '',
    streak: 0,
    score: 0,
    totalQuestions: 0,
  });
  const [showHint, setShowHint] = useState(false);

  const loadNewProblem = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, answered: false, isCorrect: false, selectedOption: null, textInput: '', currentProblem: null }));
    setShowHint(false);
    
    try {
      const problem = await generateProblem(topic.id, difficulty);
      setState(prev => ({ ...prev, currentProblem: problem, loading: false }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [topic.id, difficulty]);

  // Initial load
  useEffect(() => {
    loadNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleCheckAnswer = () => {
    if (!state.currentProblem) return;

    let isCorrect = false;
    const problem = state.currentProblem;

    if (problem.type === 'MULTIPLE_CHOICE') {
      isCorrect = state.selectedOption === problem.correctAnswer;
    } else {
      // Basic normalization for text answers (trim, lower case)
      // A more robust app might use AI to check equivalence, but exact match is safer for strict math
      isCorrect = state.textInput.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();
    }

    setState(prev => ({
      ...prev,
      answered: true,
      isCorrect,
      score: isCorrect ? prev.score + 10 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalQuestions: prev.totalQuestions + 1
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !state.answered && !state.loading) {
      handleCheckAnswer();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header bar for Quiz */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-2">
           <select 
             value={difficulty}
             onChange={(e) => {
               setDifficulty(e.target.value as Difficulty);
               // Trigger reload in next render cycle effectively or we could call loadNewProblem manually, 
               // but useEffect dependency on difficulty is tricky if we don't want immediate reload.
               // Let's rely on the user clicking "Next" or we can force reload.
               // For better UX, let's force reload:
               setTimeout(() => loadNewProblem(), 0);
             }}
             className="bg-gray-100 border-none text-sm font-semibold text-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
           >
             {Object.values(Difficulty).map(d => (
               <option key={d} value={d}>{d}</option>
             ))}
           </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-orange-500 font-bold">
             <Trophy className="w-5 h-5 mr-1" />
             <span>{state.score}</span>
          </div>
          <div className="flex items-center text-primary font-bold">
             <span className="text-xs uppercase tracking-wider text-gray-400 mr-1">Chuỗi</span>
             <span>{state.streak} 🔥</span>
          </div>
        </div>
      </div>

      {state.loading ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm animate-pulse min-h-[400px] flex flex-col justify-center items-center">
           <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
           <p className="text-gray-500 font-medium">Đang tạo bài toán thú vị cho bạn...</p>
        </div>
      ) : state.currentProblem ? (
        <div className="space-y-6 animate-fade-in-up">
          {/* Question Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
             <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
                  Câu hỏi
                </span>
                <MathDisplay content={state.currentProblem.question} className="text-xl md:text-2xl font-medium text-gray-800" />
             </div>

             {/* Input Area */}
             <div className="mb-6">
                {state.currentProblem.type === 'MULTIPLE_CHOICE' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.currentProblem.options?.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={state.answered}
                        onClick={() => setState(prev => ({ ...prev, selectedOption: option }))}
                        className={`
                          p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-center
                          ${state.selectedOption === option 
                             ? 'border-primary bg-primary/5 text-primary' 
                             : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 text-gray-700'}
                          ${state.answered && option === state.currentProblem?.correctAnswer ? 'bg-green-100 border-green-500 !text-green-800' : ''}
                          ${state.answered && state.selectedOption === option && option !== state.currentProblem?.correctAnswer ? 'bg-red-100 border-red-500 !text-red-800' : ''}
                        `}
                      > 
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                          ${state.selectedOption === option ? 'border-primary' : 'border-gray-300'}
                        `}>
                          {state.selectedOption === option && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <MathDisplay content={option} className="text-lg" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                     <input 
                       type="text"
                       value={state.textInput}
                       onChange={(e) => setState(prev => ({ ...prev, textInput: e.target.value }))}
                       onKeyDown={handleKeyDown}
                       disabled={state.answered}
                       placeholder="Nhập câu trả lời của bạn..."
                       className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition-all disabled:bg-gray-100"
                     />
                     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                       <Send className="w-5 h-5" />
                     </div>
                  </div>
                )}
             </div>

             {/* Action Bar */}
             <div className="flex flex-wrap gap-4 justify-between items-center border-t pt-6 border-gray-100">
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>

                {!state.answered ? (
                  <button 
                    onClick={handleCheckAnswer}
                    disabled={(!state.selectedOption && !state.textInput)}
                    className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <button 
                    onClick={() => loadNewProblem()}
                    className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center"
                  >
                    Câu tiếp theo <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                )}
             </div>
             
             {/* Hint Display */}
             {showHint && (
               <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm animate-fade-in border border-yellow-200">
                 <strong>Gợi ý:</strong> <MathDisplay content={state.currentProblem.hint} />
               </div>
             )}
          </div>

          {/* Result Feedback */}
          {state.answered && (
            <div className={`rounded-2xl p-6 md:p-8 animate-fade-in-up shadow-sm border ${state.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
               <div className="flex items-start mb-4">
                 {state.isCorrect ? (
                   <CheckCircle className="w-8 h-8 text-green-500 mr-4 flex-shrink-0" />
                 ) : (
                   <XCircle className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
                 )}
                 <div>
                   <h3 className={`text-xl font-bold mb-2 ${state.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                     {state.isCorrect ? 'Chính xác! Xuất sắc.' : 'Chưa đúng rồi.'}
                   </h3>
                   {!state.isCorrect && (
                     <div className="text-red-700 mb-2">
                       Đáp án đúng là: <strong>{state.currentProblem.correctAnswer}</strong>
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="mt-4 bg-white/60 p-5 rounded-xl border border-black/5">
                 <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">Giải thích chi tiết:</h4>
                 <MathDisplay content={state.currentProblem.explanation} />
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-12 text-gray-500">
          Không thể tải câu hỏi. Vui lòng thử lại.
          <button onClick={() => loadNewProblem()} className="block mx-auto mt-4 text-primary font-bold">Thử lại</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;