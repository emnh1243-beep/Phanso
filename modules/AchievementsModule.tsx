import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, User, Hash, Trash2 } from 'lucide-react';
import { getAchievements, clearAchievements } from '../utils';
import { Achievement } from '../types';
import GuideModal from '../components/GuideModal';
import { COLORS } from '../constants';
import { HelpCircle } from 'lucide-react';

interface AchievementsModuleProps {
  onBack: () => void;
}

const AchievementsModule: React.FC<AchievementsModuleProps> = ({ onBack }) => {
  const [list, setList] = useState<Achievement[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setList(getAchievements());
  }, []);

  const handleClear = () => {
    if (window.confirm("Em có chắc chắn muốn xóa toàn bộ lịch sử thành tích không?")) {
      clearAchievements();
      setList([]);
    }
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
                          <span className="text-2xl font-black text-green-500 drop-shadow-sm">{item.score}</span>
                       </div>

                       <div className="flex flex-col items-center px-4 border-l-2 border-slate-100">
                           <span className="text-xs font-bold text-slate-400 uppercase">Ngày thi</span>
                           <span className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                             <Calendar size={12} /> {formatDate(item.date)}
                           </span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {list.length > 0 && (
          <div className="mt-6 flex justify-center">
             <button 
               onClick={handleClear}
               className="flex items-center gap-2 px-8 py-3 bg-red-100 text-red-500 rounded-2xl font-black hover:bg-red-200 transition-all border-b-4 border-red-200 active:border-b-0 active:translate-y-1 active:shadow-none"
             >
               <Trash2 size={20} strokeWidth={2.5} /> Xóa lịch sử
             </button>
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

export default AchievementsModule;