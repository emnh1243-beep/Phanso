import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Utensils, HelpCircle } from 'lucide-react';
import { readNumber } from '../utils';
import { PizzaVisual } from '../components/Visuals';
import FractionDisplay from '../components/FractionDisplay';
import GuideModal from '../components/GuideModal';
import Button3D from '../components/Button3D';

interface ConceptModuleProps {
  onBack: () => void;
}

const ConceptModule: React.FC<ConceptModuleProps> = ({ onBack }) => {
  const [denom, setDenom] = useState(1); 
  const [activeSlices, setActiveSlices] = useState<boolean[]>([true]);
  const [showExplanation, setShowExplanation] = useState(false); 
  const [showFraction, setShowFraction] = useState(false);     
  const [showGuide, setShowGuide] = useState(false);

  const num = activeSlices.filter(Boolean).length;

  const handleSliceClick = (index: number) => {
    const newSlices = [...activeSlices];
    newSlices[index] = !newSlices[index];
    setActiveSlices(newSlices);
  };

  const handleDenomChange = (val: string | number) => {
    const newDenom = typeof val === 'string' ? parseInt(val) : val;
    if (isNaN(newDenom) || newDenom < 1 || newDenom > 12) return;

    setDenom(newDenom);
    
    setActiveSlices(prev => {
        let next = [...prev];
        if (newDenom > prev.length) {
            const diff = newDenom - prev.length;
            next = [...next, ...Array(diff).fill(false)];
        } else {
            next = next.slice(0, newDenom);
        }
        return next;
    });
  };

  const getReading = (n: number, d: number) => {
    let dText = String(readNumber(d)).toLowerCase();
    if (d === 4 && n !== 0) dText = "tư";
    return `${readNumber(n)} phần ${dText}`;
  };

  const guideSteps = [
    "Em hãy dùng nút mũi tên hoặc nhập số để chia chiếc bánh thành nhiều phần.",
    "Em bấm trực tiếp vào từng miếng bánh để lấy ra hoặc đặt lại.",
    "Em hãy quan sát tên gọi và các con số thay đổi theo.",
    "Em bấm vào biểu tượng con mắt để xem hoặc ẩn phân số."
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-12 relative">
      <div className="absolute top-0 right-0 md:-right-16 z-20">
        <button 
          onClick={() => setShowGuide(true)} 
          className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-95" 
          title="Hướng dẫn"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-blue-500 border-b-4 border-slate-200 ring-4 ring-blue-50 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:border-b-0 transition-all">
            <HelpCircle size={28} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-blue-500 mb-8 text-center drop-shadow-sm tracking-wide" style={{ textShadow: '2px 2px 0px white' }}>
        Hình Thành Phân Số
      </h2>
      
      <div className="flex flex-col md:flex-row items-start gap-12 bg-white/60 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(8,112,184,0.15)] backdrop-blur-md w-full justify-center border-4 border-white ring-4 ring-blue-50">
        
        {/* Cột điều khiển */}
        <div className="flex flex-col items-center gap-6 w-full md:w-auto">
          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_0_rgba(0,0,0,0.05)] w-full max-w-xs border-2 border-pink-100">
            <div className="flex justify-between items-end mb-4">
               <span className="text-xl font-black text-slate-500 uppercase">Chia bánh</span>
               <span className="text-4xl font-black text-pink-500 drop-shadow-sm">{denom} <span className="text-lg text-slate-400 font-bold">phần</span></span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 w-full border-inner shadow-inner">
              <button 
                onClick={() => handleDenomChange(denom - 1)}
                disabled={denom <= 1}
                className="p-3 bg-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-4 border-slate-200 hover:bg-pink-50 text-pink-500 transition-all active:shadow-none active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_rgba(0,0,0,0.1)]"
              >
                <ChevronDown size={24} strokeWidth={3} />
              </button>
              
              <input 
                type="number" 
                value={denom}
                onChange={(e) => handleDenomChange(e.target.value)}
                className="flex-1 text-center font-black text-3xl text-pink-500 bg-transparent outline-none drop-shadow-sm"
                min="1" max="12"
              />
              
              <button 
                onClick={() => handleDenomChange(denom + 1)}
                disabled={denom >= 12}
                className="p-3 bg-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-4 border-slate-200 hover:bg-pink-50 text-pink-500 transition-all active:shadow-none active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_rgba(0,0,0,0.1)]"
              >
                <ChevronUp size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Khung Giải Thích */}
          <div className="w-full bg-white p-6 rounded-3xl shadow-[0_8px_0_#e2e8f0] border-2 border-slate-100 mt-2 max-w-xs relative min-h-[260px] transition-all duration-300">
             
             {/* Nút ẩn/hiện nằm góc trên trái của khung */}
             <button 
               onClick={() => setShowExplanation(!showExplanation)}
               className="absolute top-3 left-3 text-purple-300 hover:text-purple-600 p-2 rounded-xl hover:bg-purple-50 transition-colors z-10"
               title={showExplanation ? "Ẩn nội dung" : "Hiện nội dung"}
             >
               {showExplanation ? <EyeOff size={24} /> : <Eye size={24} />}
             </button>

             {/* Nội dung giải thích */}
             <div className={`mt-8 transition-opacity duration-500 ${showExplanation ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <div className="text-lg text-slate-600 leading-relaxed font-medium">
                 Chiếc bánh được chia thành <span className="font-black text-pink-500 text-xl">{denom}</span> phần bằng nhau.
                 <br/>
                 Em đã lấy <span className="font-black text-blue-500 text-xl">{num}</span> phần.
                 
                 <div className="my-3 border-t-2 border-slate-100 border-dashed"></div>
                 
                 <div className="space-y-2">
                    <p>🍕 Tên gọi: <span className="font-black text-purple-600 text-xl block">{getReading(num, denom)}</span></p>
                    <p>🔹 Tử số: <span className="font-black text-blue-500 text-xl">{num}</span> (số phần lấy)</p>
                    <p>🔸 Mẫu số: <span className="font-black text-pink-500 text-xl">{denom}</span> (tổng số phần)</p>
                 </div>
               </div>
             </div>
             
             {/* Thông báo khi ẩn */}
             <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${showExplanation ? 'opacity-0' : 'opacity-100'}`}>
                 <span className="text-slate-300 font-bold italic bg-slate-50 px-4 py-2 rounded-full border border-slate-200">Đã ẩn giải thích</span>
             </div>
          </div>
        </div>

        {/* Cột hiển thị */}
        <div className="flex flex-col items-center gap-4 flex-1"> 
          
          <div className="bg-blue-50 border-b-4 border-blue-200 px-6 py-3 rounded-2xl flex items-center gap-3 text-blue-600 font-bold text-lg shadow-sm animate-bounce-short mb-2">
            <Utensils size={24} strokeWidth={2.5} />
            <span>Bấm vào miếng bánh để lấy nhé!</span>
          </div>

          <div className="transform transition-transform duration-300 hover:scale-105" style={{ perspective: '1000px' }}>
             <PizzaVisual 
               numerator={num} 
               denominator={denom} 
               size={300} 
               activeSlices={activeSlices}
               onSliceClick={handleSliceClick} 
             />
          </div>
          
          <div className="flex items-center justify-center gap-6 w-full mt-0 min-h-[120px]">
            <div className={`transition-all duration-500 transform ${showFraction ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
               <FractionDisplay 
                 numerator={num} 
                 denominator={denom} 
                 size="text-6xl" 
                 color="text-blue-600" 
                 denomColor="text-pink-500" 
               />
            </div>

            <button 
              onClick={() => setShowFraction(!showFraction)}
              className="p-3 bg-white rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-4 border-slate-200 text-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all active:shadow-none active:border-b-0 active:translate-y-1"
              title={showFraction ? "Ẩn phân số" : "Hiện phân số"}
            >
               {showFraction ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
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

export default ConceptModule;