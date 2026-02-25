import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, User, Hash, Trash2, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import { getAchievements, clearAchievements } from '../utils';
import { Achievement } from '../types';
import GuideModal from '../components/GuideModal';
import { COLORS } from '../constants';
import { HelpCircle } from 'lucide-react';
import FractionDisplay from '../components/FractionDisplay';
import { PieVisual } from '../components/Visuals';

interface AchievementsModuleProps {
  onBack: () => void;
}

const AchievementsModule: React.FC<AchievementsModuleProps> = ({ onBack }) => {
  const [list, setList] = useState<Achievement[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    setList(getAchievements());
  }, []);

  const handleClear = () => {
    clearAchievements();
    setList([]);
    setIsConfirmingClear(false);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-300';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'hard': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch(diff) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Vừa';
      case 'hard': return 'Khó';
      default: return diff;
    }
  };

  const guideSteps = [
    "Đây là bảng vàng ghi nhận những kết quả xuất sắc của các em.",
    "Kết quả bài làm ở phần Luyện Tập sẽ tự động lưu vào đây.",
    "Em có thể xem lại Tên, Lớp, Điểm số và Thời gian làm bài.",
    "Em bấm vào biểu tượng thùng rác nếu muốn xóa toàn bộ lịch sử."
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in relative pb-10">
      <div className="absolute top-0 right-0 md:-right-16 z-20">
        <button 
          onClick={() => setShowGuide(true)} 
          className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-95" 
          title="Hướng dẫn"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-orange-500 border-b-4 border-slate-200 ring-4 ring-orange-50 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:border-b-0 transition-all">
            <HelpCircle size={28} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-orange-500 mb-8 text-center drop-shadow-sm tracking-wide flex items-center gap-3" style={{ textShadow: '2px 2px 0px white' }}>
        <Trophy className="animate-bounce-short" size={48} />
        Bảng Thành Tích
      </h2>

      <div className="bg-white/60 p-6 md:p-8 rounded-[3rem] shadow-xl backdrop-blur-md w-full border-4 border-white ring-4 ring-orange-50 min-h-[500px] flex flex-col">
        
        {list.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
             <Trophy size={80} className="text-slate-300" />
             <p className="text-xl font-bold text-slate-400 text-center">Chưa có thành tích nào được ghi lại.<br/>Hãy vào phần Luyện Tập để thi tài nhé!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
               {list.map((item) => (
                 <div key={item.id} className="bg-white rounded-3xl p-4 md:p-6 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-b-4 border-orange-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:translate-y-[-2px] hover:shadow-[0_8px_0_rgba(0,0,0,0.05)] transition-all">
                    
                    {/* User Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-inner text-white font-black text-2xl border-4 border-white ring-2 ring-orange-100">
                          {item.studentName.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <h4 className="font-black text-slate-700 text-lg flex items-center gap-2">
                             {item.studentName}
                          </h4>
                          <span className="text-sm font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                             Lớp: {item.studentClass}
                          </span>
                       </div>
                    </div>

                     {/* Stats */}
                    <div className="flex items-center gap-2 md:gap-6 flex-wrap justify-center">
                       <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase border-b-4 ${getDifficultyColor(item.difficulty)}`}>
                          {getDifficultyLabel(item.difficulty)}
                       </div>
                       
                       <div className="flex flex-col items-center px-4 border-l-2 border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase">Điểm số</span>
                          <span className="text-2xl font-black text-green-500 drop-shadow-sm">
                             {item.score} <span className="text-slate-300 text-lg">/ {item.totalQuestions * 10}</span>
                          </span>
                       </div>

                       <div className="flex flex-col items-center px-4 border-l-2 border-slate-100">
                           <span className="text-xs font-bold text-slate-400 uppercase">Ngày thi</span>
                           <span className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                             <Calendar size={12} /> {formatDate(item.date)}
                           </span>
                       </div>

                       {item.history && (
                         <button 
                           onClick={() => setSelectedAchievement(item)}
                           className="ml-2 p-3 bg-blue-50 text-blue-500 rounded-2xl hover:bg-blue-100 transition-all border-b-4 border-blue-200 active:border-b-0 active:translate-y-1"
                           title="Xem chi tiết"
                         >
                           <Eye size={20} strokeWidth={2.5} />
                         </button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {list.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-4">
             {!isConfirmingClear ? (
               <button 
                 onClick={() => setIsConfirmingClear(true)}
                 className="flex items-center gap-2 px-8 py-3 bg-red-100 text-red-500 rounded-2xl font-black hover:bg-red-200 transition-all border-b-4 border-red-200 active:border-b-0 active:translate-y-1 active:shadow-none"
               >
                 <Trash2 size={20} strokeWidth={2.5} /> Xóa lịch sử
               </button>
             ) : (
               <div className="flex flex-col items-center gap-3 bg-red-50 p-6 rounded-[2rem] border-2 border-red-100 animate-fade-in">
                  <p className="text-red-600 font-bold text-center">Em có chắc chắn muốn xóa toàn bộ lịch sử không?</p>
                  <div className="flex gap-4">
                     <button 
                       onClick={handleClear}
                       className="px-6 py-2 bg-red-500 text-white rounded-xl font-black hover:bg-red-600 transition-all shadow-md active:scale-95"
                     >
                       Có, xóa hết
                     </button>
                     <button 
                       onClick={() => setIsConfirmingClear(false)}
                       className="px-6 py-2 bg-white text-slate-500 rounded-xl font-black border-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                     >
                       Không, quay lại
                     </button>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        title="Hướng Dẫn" 
        steps={guideSteps} 
      />

      {/* Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white ring-8 ring-blue-50">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                       <Trophy size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-wide">Chi tiết bài làm</h3>
                       <p className="text-sm font-bold opacity-80">{selectedAchievement.studentName} - Lớp {selectedAchievement.studentClass}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedAchievement(null)}
                   className="p-2 hover:bg-white/20 rounded-full transition-all"
                 >
                   <X size={28} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50">
                 <div className="flex flex-col gap-4">
                    {selectedAchievement.history?.map((item, idx) => (
                       <div key={idx} className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${item.isCorrect ? 'border-green-100' : 'border-red-100'} flex flex-col gap-4`}>
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">
                                   {idx + 1}
                                </span>
                                <p className="font-bold text-slate-700">{item.question.text}</p>
                             </div>
                             {item.isCorrect ? (
                                <div className="flex items-center gap-1 text-green-500 font-black text-sm uppercase">
                                   <CheckCircle size={20} /> Đúng
                                </div>
                             ) : (
                                <div className="flex items-center gap-1 text-red-500 font-black text-sm uppercase">
                                   <XCircle size={20} /> Sai
                                </div>
                             )}
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-8 py-4 bg-slate-50/50 rounded-2xl">
                             {/* Question Content */}
                             {item.question.type === 'choice' && item.question.target && (
                                <div className="flex flex-col items-center gap-2">
                                   <span className="text-xs font-bold text-slate-400 uppercase">Câu hỏi</span>
                                   {item.question.mode === 'visual_to_frac' ? (
                                      <PieVisual numerator={item.question.target.n || 0} denominator={item.question.target.d || 1} size={80} color="#6366f1" />
                                   ) : (
                                      <FractionDisplay numerator={item.question.target.n} denominator={item.question.target.d} size="text-2xl" />
                                   )}
                                </div>
                             )}

                             {(item.question.type === 'fill' || item.question.type === 'drag') && item.question.left && item.question.right && (
                                <div className="flex items-center gap-4">
                                   <FractionDisplay numerator={item.question.left.n} denominator={item.question.left.d} size="text-2xl" />
                                   <span className="text-2xl font-black text-slate-300">=</span>
                                   <div className="flex flex-col items-center">
                                      <span className="text-2xl font-black text-slate-700">{item.question.right.n ?? '?'}</span>
                                      <div className="w-8 h-1 bg-slate-700 rounded-full my-1"></div>
                                      <span className="text-2xl font-black text-slate-700">{item.question.right.d ?? '?'}</span>
                                   </div>
                                </div>
                             )}

                             <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                             {/* Answer Content */}
                             <div className="flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Em chọn</span>
                                <div className={`font-black text-xl ${item.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                   {item.question.type === 'choice' ? (
                                      item.userAnswer.n ? (
                                         <div className="flex flex-col items-center">
                                            <span>{item.userAnswer.n}/{item.userAnswer.d}</span>
                                         </div>
                                      ) : 'Hình vẽ'
                                   ) : item.userAnswer}
                                </div>
                             </div>

                             {!item.isCorrect && (
                                <>
                                   <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                                   <div className="flex flex-col items-center gap-2">
                                      <span className="text-xs font-bold text-slate-400 uppercase">Đáp án đúng</span>
                                      <div className="font-black text-xl text-green-600">
                                         {item.question.type === 'choice' ? (
                                            `${item.question.correctValue.n}/${item.question.correctValue.d}`
                                         ) : item.question.correctValue}
                                      </div>
                                   </div>
                                </>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-white border-t-2 border-slate-100 flex justify-center">
                 <button 
                   onClick={() => setSelectedAchievement(null)}
                   className="px-10 py-3 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                 >
                   Đóng lại
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsModule;