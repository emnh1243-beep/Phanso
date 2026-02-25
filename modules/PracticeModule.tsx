
import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  Star,
  RefreshCw,
  Trophy,
  MousePointer2,
  Keyboard,
  ListFilter,
  ArrowLeft,
  PieChart,
  CheckCircle,
  XCircle,
  Hash,
  Brain,
  HelpCircle,
  User,
  School,
  Crown,
  Award,
  ThumbsUp,
  BookOpen,
  Eye,
  ArrowRight
} from 'lucide-react';
import { playSound, saveAchievement } from '../utils';
import { PieVisual } from '../components/Visuals';
import FractionDisplay from '../components/FractionDisplay';
import Button3D from '../components/Button3D';
import GuideModal from '../components/GuideModal';
import Input3D from '../components/Input3D';
import Confetti from '../components/Confetti';
import { COLORS } from '../constants';
import { QuestionData, HistoryItem } from '../types';

interface PracticeModuleProps {
  onBack: () => void;
}

const PracticeModule: React.FC<PracticeModuleProps> = ({ onBack }) => {
  const [setupMode, setSetupMode] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy'); 
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['choice', 'fill', 'drag']); 
  const [score, setScore] = useState(0);
  
  // Changed from single question to a queue
  const [questionsQueue, setQuestionsQueue] = useState<QuestionData[]>([]);
  
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false); // State for showing answer
  const [fillAnswer, setFillAnswer] = useState('');
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [questionCountOption, setQuestionCountOption] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [showGuide, setShowGuide] = useState(false);
  
  // User Info States
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentQuestion = questionsQueue[currentQuestionIndex];

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateUniqueOptions = (correctOption: any, count: number, generateFn: () => any, compareFn: (a: any, b: any) => boolean) => {
    const options = [correctOption];
    let attempts = 0;
    while (options.length < count && attempts < 50) {
      const wrong = generateFn();
      const isDuplicate = options.some(opt => compareFn(opt, wrong));
      if (!isDuplicate) options.push(wrong);
      attempts++;
    }
    return options.sort(() => Math.random() - 0.5);
  };

  // Helper to generate a single random question
  const generateRandomQuestion = (): QuestionData => {
    let maxDenom = 5;
    if (difficulty === 'medium') maxDenom = 12;
    if (difficulty === 'hard') maxDenom = 25;

    const availableTypes = selectedTypes.length > 0 ? selectedTypes : ['choice'];
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const n = rand(1, maxDenom - 1);
    const d = rand(n + 1, maxDenom);
    
    let qData: QuestionData;

    if (type === 'choice') {
      const isVisualQuestion = Math.random() > 0.5;
      // mode: 'visual_to_frac' -> Display Visual (Target), User picks Fraction (Option)
      // mode: 'frac_to_visual' -> Display Fraction (Target), User picks Visual (Option)
      
      const questionText = isVisualQuestion 
        ? 'Em hãy chọn phân số phù hợp với hình vẽ trên nhé!' 
        : 'Em hãy tìm hình vẽ thể hiện phân số đã cho nhé!';

      qData = {
        type: 'choice',
        mode: isVisualQuestion ? 'visual_to_frac' : 'frac_to_visual',
        text: questionText,
        target: { n, d },
        options: [],
        correctValue: { n, d }
      };

      const genWrong = () => {
        const wn = rand(1, maxDenom);
        const wd = rand(wn, maxDenom);
        return { n: wn, d: wd, correct: false };
      };
      
      const compareFn = (a: any, b: any) => a.n === b.n && a.d === b.d;
      qData.options = generateUniqueOptions({ n, d, correct: true }, 3, genWrong, compareFn);
    } 
    else if (type === 'fill') {
      const factor = rand(2, 4);
      const missingPos = Math.random() > 0.5 ? 'top' : 'bottom';
      const targetN = n * factor;
      const targetD = d * factor;

      qData = {
        type: 'fill',
        text: 'Em hãy điền số thích hợp vào chỗ trống nhé:',
        left: { n, d },
        right: { n: targetN, d: targetD },
        missing: missingPos,
        correctValue: missingPos === 'top' ? targetN : targetD
      };
      
      if (qData.right) {
         if (missingPos === 'top') qData.right.n = null; else qData.right.d = null;
      }
    }
    else {
      // type === 'drag'
      const factor = rand(2, 3);
      const targetN = n * factor;
      const targetD = d * factor;
      const correctVal = targetN;

      qData = {
        type: 'drag',
        text: 'Em hãy kéo số đúng vào dấu hỏi chấm nhé:',
        left: { n, d },
        right: { n: null, d: targetD },
        correctValue: correctVal,
        options: []
      };

      const genWrongNum = () => rand(1, targetD);
      const compareNum = (a: number, b: number) => a === b;
      qData.options = generateUniqueOptions(correctVal, 4, genWrongNum, compareNum);
    }
    
    return qData;
  };

  const getQuestionSignature = (q: QuestionData): string => {
    if (q.type === 'choice') {
      return `choice-${q.mode}-${q.target?.n}-${q.target?.d}`;
    }
    if (q.type === 'fill') {
      // Differentiate fill questions by numbers and missing position
      return `fill-${q.left?.n}-${q.left?.d}-${q.right?.n}-${q.right?.d}-${q.missing}`;
    }
    if (q.type === 'drag') {
      return `drag-${q.left?.n}-${q.left?.d}-${q.correctValue}`;
    }
    return Math.random().toString();
  };

  const startGame = () => {
    if (selectedTypes.length === 0) return;
    if (!studentName.trim() || !studentClass.trim()) {
        alert("Vui lòng nhập Tên và Lớp của em để bắt đầu!");
        return;
    }

    // Generate unique question set
    const newQuestions: QuestionData[] = [];
    const signatures = new Set<string>();
    let attempts = 0;
    
    // Safety break to prevent infinite loops if pool is too small for requested count
    const MAX_ATTEMPTS = questionCountOption * 10; 

    while (newQuestions.length < questionCountOption && attempts < MAX_ATTEMPTS) {
      const q = generateRandomQuestion();
      const sig = getQuestionSignature(q);

      if (!signatures.has(sig)) {
        signatures.add(sig);
        newQuestions.push(q);
      }
      attempts++;
    }

    if (newQuestions.length < questionCountOption) {
      // Fallback if we couldn't find enough unique questions (rare on high counts/low difficulty)
      // Just fill the rest with random ones allowing duplicates
      while (newQuestions.length < questionCountOption) {
         newQuestions.push(generateRandomQuestion());
      }
    }

    setQuestionsQueue(newQuestions);
    setScore(0);
    setCurrentQuestionIndex(0);
    setHistory([]);
    setFeedback(null);
    setShowAnswer(false);
    setFillAnswer('');
    setDragItem(null);
    setGameState('playing');
  };

  const finishGame = (finalScore: number) => {
    setGameState('finished');
    setIsSaved(false);
    
    // Save achievement
    if (studentName && studentClass) {
        saveAchievement({
            studentName,
            studentClass,
            score: finalScore,
            totalQuestions: questionCountOption,
            difficulty,
            history: history
        });
        setIsSaved(true);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      return [...prev, type];
    });
  };

  const handleNextQuestion = (isCorrect: boolean, userAnswer: any) => {
    let currentScore = score;
    if (isCorrect) {
        currentScore += 10;
        setScore(currentScore);
        setFeedback('correct');
        playSound('correct');
        
        // Save history immediately
        if (currentQuestion) {
            setHistory(prev => [...prev, {
                question: currentQuestion,
                userAnswer: userAnswer,
                isCorrect: isCorrect
            }]);
        }

        // Auto advance only if correct
        setTimeout(() => {
            resetAndNext(currentScore);
        }, 1500);

    } else {
        setFeedback('wrong');
        playSound('wrong');
        // Do NOT auto advance, let user see answer or try to click next
        if (currentQuestion) {
            setHistory(prev => [...prev, {
                question: currentQuestion,
                userAnswer: userAnswer,
                isCorrect: isCorrect
            }]);
        }
    }
  };

  const resetAndNext = (finalScoreForFinish: number) => {
    setFeedback(null);
    setFillAnswer('');
    setDragItem(null);
    setShowAnswer(false);

    if (currentQuestionIndex + 1 >= questionCountOption) {
        finishGame(finalScoreForFinish);
    } else {
        setCurrentQuestionIndex(i => i + 1);
    }
  };

  const manualNextQuestion = () => {
      resetAndNext(score);
  };

  const handleChoiceAnswer = (opt: any) => {
      // Prevent clicking if feedback is showing
      if (feedback) return;
      const isCorrect = opt.correct; 
      handleNextQuestion(isCorrect, opt);
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) return;
    if (!currentQuestion) return;
    const val = parseInt(fillAnswer);
    handleNextQuestion(val === currentQuestion.correctValue, val);
  };

  const handleDragStartPractice = (e: React.DragEvent, val: number) => {
    e.dataTransfer.setData("val", val.toString());
  };
  
  const handleDropPractice = (e: React.DragEvent) => {
    e.preventDefault();
    if (feedback) return;
    if (!currentQuestion) return;
    const val = parseInt(e.dataTransfer.getData("val"));
    setDragItem(val);
    handleNextQuestion(val === currentQuestion.correctValue, val);
  };

  const renderCorrectAnswer = () => {
      if (!currentQuestion) return null;

      if (currentQuestion.type === 'choice') {
          const val = currentQuestion.correctValue;
          // mode: 'frac_to_visual' -> Question shows Fraction, asks to pick Visual. Correct answer is a Visual.
          if (currentQuestion.mode === 'frac_to_visual') {
              return (
                  <div className="transform scale-90 p-2">
                     <PieVisual numerator={val.n} denominator={val.d} size={120} color="#22c55e" />
                  </div>
              );
          } else {
              // mode: 'visual_to_frac' -> Question shows Visual, asks to pick Fraction. Correct answer is a Fraction.
              return (
                  <div className="transform scale-90">
                    <FractionDisplay numerator={val.n} denominator={val.d} size="text-4xl" color="text-red-500" />
                  </div>
              );
          }
      }

      // For fill and drag types, the correct value is a number
      return <span className="text-5xl font-black text-red-500">{currentQuestion.correctValue}</span>;
  };

  const guideSteps = [
    "Em hãy nhập Tên và Lớp học của mình vào ô tương ứng.",
    "Em chọn số lượng câu hỏi, mức độ khó và dạng bài tập.",
    "Em bấm 'Bắt đầu làm bài' để vào chơi.",
    "Kết quả của em sẽ được tự động lưu vào Bảng Thành Tích khi hoàn thành!"
  ];

  if (gameState === 'setup') {
    return (
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto animate-fade-in relative">
        <div className="absolute top-0 right-0 md:-right-16 z-20">
          <button 
            onClick={() => setShowGuide(true)} 
            className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-95" 
            title="Hướng dẫn"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-purple-600 border-b-4 border-slate-200 ring-4 ring-purple-50 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:border-b-0 transition-all">
              <HelpCircle size={28} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        <h2 className="text-4xl font-black text-purple-600 mb-8 drop-shadow-sm uppercase" style={{ textShadow: '2px 2px 0px white' }}>Cài Đặt Luyện Tập</h2>
        
        <div className="bg-white/70 p-8 rounded-[2.5rem] shadow-xl border-4 border-white backdrop-blur-md w-full flex flex-col gap-8 ring-4 ring-purple-50">
           
           {/* User Info Section */}
           <div className="bg-white p-6 rounded-3xl shadow-[0_6px_0_rgba(0,0,0,0.05)] border-2 border-purple-50">
             <h3 className="text-xl font-bold text-slate-500 mb-4 uppercase flex items-center gap-2"><User size={24}/> Thông tin học sinh</h3>
             <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1">
                 <Input3D 
                   type="text"
                   value={studentName}
                   onChange={(e) => setStudentName(e.target.value)}
                   placeholder="Nhập tên của em..."
                   className="text-lg"
                 />
               </div>
               <div className="w-full md:w-1/3">
                 <Input3D 
                   type="text"
                   value={studentClass}
                   onChange={(e) => setStudentClass(e.target.value)}
                   placeholder="Lớp..."
                   className="text-lg"
                 />
               </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold text-slate-500 mb-4 uppercase flex items-center gap-2 ml-2"><Hash size={24}/> Số câu hỏi</h3>
             <div className="grid grid-cols-3 gap-4">
                {[5, 10, 20].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCountOption(count)}
                    className={`
                      py-4 rounded-2xl font-black text-lg transition-all border-b-4 active:border-b-0 active:translate-y-1
                      ${questionCountOption === count 
                        ? 'bg-cyan-500 text-white border-cyan-700 shadow-[0_4px_0_#0e7490]' 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-cyan-300 shadow-[0_4px_0_#e2e8f0]'}
                    `}
                  >
                    {count} câu
                  </button>
                ))}
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold text-slate-500 mb-4 uppercase flex items-center gap-2 ml-2"><Brain size={24}/> Độ khó</h3>
             <div className="grid grid-cols-3 gap-4">
                {[
                  {id: 'easy', label: 'Dễ 🐣', color: 'bg-green-400', border: 'border-green-600', shadow: 'shadow-[0_4px_0_#16a34a]'},
                  {id: 'medium', label: 'Vừa 🐥', color: 'bg-orange-400', border: 'border-orange-600', shadow: 'shadow-[0_4px_0_#ea580c]'},
                  {id: 'hard', label: 'Khó 🦅', color: 'bg-red-400', border: 'border-red-600', shadow: 'shadow-[0_4px_0_#dc2626]'}
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setDifficulty(item.id as any)}
                    className={`
                      py-4 rounded-2xl font-black text-lg transition-all border-b-4 active:border-b-0 active:translate-y-1
                      ${difficulty === item.id
                        ? `${item.color} text-white ${item.border} ${item.shadow}` 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-purple-300 shadow-[0_4px_0_#e2e8f0]'}
                    `}
                  >
                    {item.label}
                  </button>
                ))}
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold text-slate-500 mb-4 uppercase flex items-center gap-2 ml-2"><ListFilter size={24}/> Dạng bài tập</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                   onClick={() => toggleType('choice')}
                   className={`
                     p-4 rounded-2xl border-2 border-b-8 flex flex-col items-center gap-2 transition-all active:border-b-4 active:translate-y-1
                     ${selectedTypes.includes('choice') 
                       ? 'bg-blue-400 border-blue-600 text-white shadow-sm' 
                       : 'bg-white border-slate-200 text-slate-400 opacity-70 hover:opacity-100'}
                   `}
                >
                   <PieChart size={32} strokeWidth={2.5} />
                   <span className="font-bold">Trắc Nghiệm</span>
                </button>
                <button
                   onClick={() => toggleType('fill')}
                   className={`
                     p-4 rounded-2xl border-2 border-b-8 flex flex-col items-center gap-2 transition-all active:border-b-4 active:translate-y-1
                     ${selectedTypes.includes('fill') 
                       ? 'bg-teal-400 border-teal-600 text-white shadow-sm' 
                       : 'bg-white border-slate-200 text-slate-400 opacity-70 hover:opacity-100'}
                   `}
                >
                   <Keyboard size={32} strokeWidth={2.5} />
                   <span className="font-bold">Điền Số</span>
                </button>
                <button
                   onClick={() => toggleType('drag')}
                   className={`
                     p-4 rounded-2xl border-2 border-b-8 flex flex-col items-center gap-2 transition-all active:border-b-4 active:translate-y-1
                     ${selectedTypes.includes('drag') 
                       ? 'bg-fuchsia-400 border-fuchsia-600 text-white shadow-sm' 
                       : 'bg-white border-slate-200 text-slate-400 opacity-70 hover:opacity-100'}
                   `}
                >
                   <MousePointer2 size={32} strokeWidth={2.5} />
                   <span className="font-bold">Kéo Thả</span>
                </button>
             </div>
             {selectedTypes.length === 0 && <p className="text-red-500 text-sm mt-2 font-bold text-center animate-pulse">Hãy chọn ít nhất một dạng bài!</p>}
             {(!studentName || !studentClass) && <p className="text-red-500 text-sm mt-2 font-bold text-center">Đừng quên nhập tên và lớp nhé!</p>}
           </div>

           <Button3D 
              onClick={startGame} 
              color="bg-pink-500" 
              icon={Play} 
              label="BẮT ĐẦU LÀM BÀI" 
              className="w-full mt-4" 
              disabled={selectedTypes.length === 0 || !studentName.trim() || !studentClass.trim()} 
           />
        </div>

        <GuideModal 
          isOpen={showGuide} 
          onClose={() => setShowGuide(false)} 
          title="Hướng Dẫn" 
          steps={guideSteps} 
        />
      </div>
    );
  }

  if (gameState === 'finished') {
    // Determine Rank
    const totalPossibleScore = questionCountOption * 10;
    const percentage = Math.round((score / totalPossibleScore) * 100);
    const isSuccess = percentage >= 80;

    let RankIcon = BookOpen;
    let rankColor = 'text-slate-500';
    let rankLabel = 'Học Sinh Chăm Chỉ';
    let rankBg = 'bg-slate-100';

    if (percentage === 100) {
        RankIcon = Crown;
        rankColor = 'text-yellow-500';
        rankLabel = 'Thần Đồng Toán Học';
        rankBg = 'bg-yellow-100';
    } else if (percentage >= 80) {
        RankIcon = Award;
        rankColor = 'text-orange-500';
        rankLabel = 'Học Sinh Xuất Sắc';
        rankBg = 'bg-orange-100';
    } else if (percentage >= 50) {
        RankIcon = ThumbsUp;
        rankColor = 'text-blue-500';
        rankLabel = 'Học Sinh Khá';
        rankBg = 'bg-blue-100';
    }

     return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-10">
           {/* Celebration Confetti */}
           {isSuccess && <Confetti />}

           <div className="bg-white/80 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white backdrop-blur-md w-full flex flex-col items-center gap-6 relative overflow-hidden z-10">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200 to-transparent opacity-50 pointer-events-none"></div>
              
              <div className="relative">
                 <div className={`p-6 rounded-full ${rankBg} shadow-inner mb-2 border-4 border-white ring-4 ${rankColor.replace('text', 'ring')}`}>
                    <RankIcon size={80} className={`${rankColor} drop-shadow-lg ${isSuccess ? 'animate-bounce' : ''}`} />
                 </div>
              </div>
              
              <div className="flex flex-col items-center">
                <h2 className={`text-4xl font-black ${rankColor} uppercase tracking-wide drop-shadow-sm text-center`} style={{ textShadow: '2px 2px 0px white' }}>{rankLabel}</h2>
                <span className="text-slate-400 font-bold mt-2">Em đã hoàn thành bài thi!</span>
                {isSaved && (
                   <div className="mt-4 bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse border border-green-200 shadow-sm">
                     <Check size={16}/> Đã lưu vào Bảng Thành Tích
                   </div>
                )}
              </div>

              <div className="text-3xl font-bold text-slate-500">Điểm số: <span className={`${percentage >= 50 ? 'text-green-500' : 'text-slate-600'} text-5xl`}>{score}</span> / {totalPossibleScore}</div>
              
              <div className="flex items-center gap-6 bg-white/50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2">
                    <User className="text-slate-400" size={20} />
                    <span className="font-black text-slate-600 text-lg">{studentName}</span>
                 </div>
                 <div className="w-0.5 h-6 bg-slate-300"></div>
                 <div className="flex items-center gap-2">
                    <School className="text-slate-400" size={20} />
                    <span className="font-bold text-slate-500">{studentClass}</span>
                 </div>
              </div>

              <div className="w-full mt-2 bg-white rounded-3xl shadow-inner p-4 max-h-[400px] overflow-y-auto border-2 border-slate-100 custom-scrollbar">
                 <h3 className="text-xl font-black text-slate-400 mb-4 px-2 uppercase">Chi tiết bài làm</h3>
                 <div className="flex flex-col gap-3">
                    {history.map((item, idx) => (
                       <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border-b-4 ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-center gap-4">
                             <span className="font-black text-slate-300 text-xl">#{idx + 1}</span>
                             <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm">{item.question.text}</span>
                                {!item.isCorrect && (
                                   <span className="text-xs text-red-400 font-medium mt-1">
                                     Đáp án đúng: {
                                        item.question.type === 'choice' 
                                        ? `${item.question.correctValue?.n}/${item.question.correctValue?.d}` 
                                        : item.question.correctValue
                                     }
                                   </span>
                                )}
                             </div>
                          </div>
                          <div>
                             {item.isCorrect ? <CheckCircle className="text-green-500 drop-shadow-sm" size={32} /> : <XCircle className="text-red-500 drop-shadow-sm" size={32} />}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex gap-4 mt-4 w-full">
                 <Button3D onClick={() => setGameState('setup')} color={COLORS.primary} icon={ArrowLeft} label="Về Menu" className="flex-1" />
                 <Button3D onClick={startGame} color={COLORS.success} icon={RefreshCw} label="Làm Lại" className="flex-1" />
              </div>
           </div>
        </div>
     );
  }

  if (!currentQuestion) return <div className="p-10 text-center font-bold text-slate-500">Đang tải câu hỏi...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col w-full mb-6 px-4 gap-4 mt-2"> 
         <div className="flex justify-between items-center">
            <button onClick={() => setGameState('setup')} className="p-3 bg-white border-b-4 border-slate-200 hover:border-purple-300 active:border-b-0 active:translate-y-1 rounded-2xl text-slate-400 hover:text-purple-600 shadow-sm hover:shadow-md transition-all"> 
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border-b-4 border-slate-100">
               <span className="text-slate-400 font-bold text-sm uppercase">Câu hỏi</span>
               <span className="text-2xl font-black text-purple-600">{currentQuestionIndex + 1}</span>
               <span className="text-slate-300 font-black text-xl">/</span>
               <span className="text-slate-400 font-bold text-lg">{questionCountOption}</span>
            </div>

            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-2xl shadow-sm text-yellow-700 border-b-4 border-yellow-300">
               <Star size={20} fill="currentColor" />
               <span className="font-black text-xl">{score}</span>
            </div>
         </div>
         
         <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ease-out rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] relative"
              style={{ width: `${((currentQuestionIndex) / questionCountOption) * 100}%` }}
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
            </div>
         </div>
      </div>

      <div className="bg-white/60 p-8 rounded-[3rem] shadow-xl backdrop-blur-md w-full border-4 border-white flex flex-col items-center gap-8 min-h-[400px] ring-4 ring-purple-50 relative overflow-hidden">
        
        <div className="bg-white px-8 py-4 rounded-2xl shadow-[0_6px_0_#e2e8f0] border-2 border-slate-100 transform -rotate-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-600 text-center">
            {currentQuestion.text}
          </h3>
        </div>

        {currentQuestion.type === 'choice' && currentQuestion.target && (
          <>
            <div className="p-6 bg-white rounded-[2rem] shadow-[0_10px_0_rgba(0,0,0,0.05)] mb-4 transform hover:scale-105 transition-transform border-4 border-slate-50">
               {currentQuestion.mode === 'visual_to_frac' ? (
                 <PieVisual numerator={currentQuestion.target.n || 0} denominator={currentQuestion.target.d || 1} size={140} color="#FF6B6B" />
               ) : (
                 <FractionDisplay numerator={currentQuestion.target.n} denominator={currentQuestion.target.d} />
               )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
              {currentQuestion.options && currentQuestion.options.map((opt, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleChoiceAnswer(opt)}
                   disabled={!!feedback}
                   className={`
                     w-full relative group transition-all duration-200 transform hover:-translate-y-1 active:translate-y-1
                     ${feedback === 'correct' && opt.correct ? 'opacity-100 scale-110 z-10' : ''}
                     ${feedback === 'correct' && !opt.correct ? 'opacity-30 blur-sm' : ''}
                     ${feedback === 'wrong' ? 'opacity-50 cursor-not-allowed' : ''}
                   `}
                 >
                   <div className={`
                     bg-white rounded-3xl p-6 border-b-8 shadow-xl flex flex-col items-center gap-4 h-full justify-center transition-colors
                     ${feedback === 'correct' && opt.correct ? 'border-green-500 bg-green-50 ring-4 ring-green-200 shadow-[0_8px_0_#16a34a]' : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'}
                     ${feedback === 'wrong' && !opt.correct ? 'border-red-200 bg-red-50' : ''}
                   `}>
                     {currentQuestion.mode === 'visual_to_frac' ? (
                       <FractionDisplay numerator={opt.n} denominator={opt.d} size="text-3xl" />
                     ) : (
                       <PieVisual numerator={opt.n} denominator={opt.d} size={100} color={COLORS.purple} />
                     )}
                   </div>
                 </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.type === 'fill' && currentQuestion.left && currentQuestion.right && (
          <div className="flex flex-col items-center gap-8 w-full">
             <div className="flex items-center gap-4 md:gap-8 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_0_#e2e8f0] border-2 border-slate-100">
                <FractionDisplay numerator={currentQuestion.left.n} denominator={currentQuestion.left.d} size="text-5xl" />
                <span className="text-4xl font-black text-slate-300">=</span>
                <div className="flex flex-col items-center gap-2">
                   {currentQuestion.missing === 'top' ? (
                     <input 
                       type="number" 
                       value={fillAnswer}
                       onChange={(e) => setFillAnswer(e.target.value)}
                       className="w-28 h-28 text-center text-6xl font-black text-purple-600 bg-white border-b-8 border-purple-200 rounded-3xl focus:outline-none focus:border-purple-400 shadow-inner"
                       placeholder="?"
                       autoFocus
                     />
                   ) : <span className="text-5xl font-black text-slate-700">{currentQuestion.right.n}</span>}
                   <div className="w-24 h-2 bg-slate-700 rounded-full my-2"></div>
                   {currentQuestion.missing === 'bottom' ? (
                     <input 
                       type="number" 
                       value={fillAnswer}
                       onChange={(e) => setFillAnswer(e.target.value)}
                       className="w-28 h-28 text-center text-6xl font-black text-purple-600 bg-white border-b-8 border-purple-200 rounded-3xl focus:outline-none focus:border-purple-400 shadow-inner"
                       placeholder="?"
                       autoFocus
                     />
                   ) : <span className="text-5xl font-black text-slate-700">{currentQuestion.right.d}</span>}
                </div>
             </div>
             <form onSubmit={handleFillSubmit}>
                <Button3D type="submit" color="bg-sky-500" icon={Check} label="Kiểm tra" className="scale-110" disabled={!!feedback} />
             </form>
          </div>
        )}

        {currentQuestion.type === 'drag' && currentQuestion.left && currentQuestion.right && (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center gap-4 md:gap-10 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_0_#e2e8f0] border-2 border-slate-100">
                <FractionDisplay numerator={currentQuestion.left.n} denominator={currentQuestion.left.d} size="text-5xl" />
                <span className="text-4xl font-black text-slate-300">=</span>
                <div className="flex flex-col items-center gap-2">
                   <div 
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={handleDropPractice}
                     className={`w-32 h-32 rounded-3xl flex items-center justify-center transition-all border-4 border-dashed
                       ${dragItem ? 'bg-green-50 border-green-400 border-solid shadow-inner' : 'bg-slate-50 border-slate-300 hover:bg-blue-50 hover:border-blue-400'}
                     `}
                   >
                     {dragItem ? (
                       <span className="text-6xl font-black text-green-600 animate-bounce-short">{dragItem}</span>
                     ) : <span className="text-5xl font-bold text-slate-300">?</span>}
                   </div>
                   <div className="w-32 h-2.5 bg-slate-700 rounded-full my-2"></div>
                   <span className="text-5xl font-black text-slate-700">{currentQuestion.right.d}</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 p-6 bg-indigo-50/50 rounded-[2rem] w-full border-2 border-white shadow-inner">
               {currentQuestion.options && currentQuestion.options.map((val, idx) => (
                 <div
                   key={idx}
                   draggable={!feedback}
                   onDragStart={(e) => handleDragStartPractice(e, val)}
                   className={`w-20 h-20 bg-white border-b-4 border-indigo-200 text-indigo-600 rounded-2xl shadow-sm flex items-center justify-center text-4xl font-black transition-all
                     ${!feedback ? 'cursor-grab hover:scale-110 hover:-translate-y-2 hover:shadow-lg hover:border-indigo-400 active:cursor-grabbing active:border-b-0 active:translate-y-1' : 'opacity-50 cursor-not-allowed'}
                   `}
                 >
                   {val}
                 </div>
               ))}
            </div>
            <div className="text-sm text-slate-400 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"><MousePointer2 size={16}/> Kéo số vào dấu hỏi chấm</div>
          </div>
        )}

        {feedback === 'correct' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[3rem] z-20 animate-fade-in">
             <div className="flex flex-col items-center gap-4 animate-bounce-short">
               <Trophy size={100} className="text-yellow-500 drop-shadow-2xl" fill="currentColor" />
               <h2 className="text-5xl font-black text-green-500 tracking-wide drop-shadow-sm" style={{ textShadow: '2px 2px 0px white' }}>XUẤT SẮC!</h2>
             </div>
          </div>
        )}
        
        {feedback === 'wrong' && (
          <div className="absolute bottom-4 animate-shake bg-red-100 text-red-500 px-6 py-4 rounded-3xl font-bold text-xl border-b-8 border-red-200 shadow-xl flex flex-col items-center gap-3 z-30 max-w-sm w-full mx-4">
             <span className="text-center">{showAnswer ? 'Đáp án đúng là:' : 'Chưa chính xác, cố gắng lên nào! 💪'}</span>
             
             {showAnswer && (
                 <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-red-100 animate-fade-in flex justify-center items-center min-w-[150px] min-h-[80px]">
                    {renderCorrectAnswer()}
                 </div>
             )}

             <div className="flex gap-2 mt-2 w-full justify-center">
               {!showAnswer && (
                   <button 
                     onClick={() => setShowAnswer(true)} 
                     className="px-4 py-2 bg-white text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 font-bold flex items-center gap-2 shadow-sm active:translate-y-1 transition-all"
                   >
                      <Eye size={18} /> Xem đáp án
                   </button>
               )}
               <button 
                 onClick={manualNextQuestion} 
                 className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-bold flex items-center gap-2 shadow-[0_4px_0_#991b1b] border-b-0 active:translate-y-1 active:shadow-none transition-all"
               >
                  Câu tiếp theo <ArrowRight size={18} strokeWidth={3} />
               </button>
             </div>
          </div>
        )}

      </div>
      
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        title="Hướng Dẫn" 
        steps={guideSteps} 
      />
    </div>
  );
};

export default PracticeModule;
