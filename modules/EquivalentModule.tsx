import React, { useState } from 'react';
import { X as Multiply, Divide, Eye, EyeOff, ArrowRight, XCircle, Equal, HelpCircle } from 'lucide-react';
import { PieVisual } from '../components/Visuals';
import FractionDisplay from '../components/FractionDisplay';
import GuideModal from '../components/GuideModal';
import Button3D from '../components/Button3D';

interface EquivalentModuleProps {
  onBack: () => void;
}

const EquivalentModule: React.FC<EquivalentModuleProps> = ({ onBack }) => {
  const [baseNum, setBaseNum] = useState(1);
  const [baseDenom, setBaseDenom] = useState(2);
  const [factor, setFactor] = useState(2); 
  const [operation, setOperation] = useState<'multiply' | 'divide'>('multiply'); 
  const [showResult, setShowResult] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  let eqNum = baseNum;
  let eqDenom = baseDenom;
  let isDivisible = true;

  if (operation === 'multiply') {
    eqNum = baseNum * factor;
    eqDenom = baseDenom * factor;
  } else {
    if (baseNum % factor === 0 && baseDenom % factor === 0) {
      eqNum = baseNum / factor;
      eqDenom = baseDenom / factor;
    } else {
      isDivisible = false;
    }
  }

  const guideSteps = [
    "Em hãy nhập tử số và mẫu số của phân số gốc ở khung bên trái.",
    "Em chọn phép tính Nhân (x) hoặc Chia (:) ở giữa.",
    "Em thay đổi số nhân/chia bằng nút (+) hoặc (-).",
    "Em quan sát hình vẽ để thấy hai phân số luôn bằng nhau dù số lượng phần thay đổi."
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto animate-fade-in relative">
      <div className="absolute top-0 right-0 md:-right-16 z-20">
        <button 
          onClick={() => setShowGuide(true)} 
          className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-95" 
          title="Hướng dẫn"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-pink-500 border-b-4 border-slate-200 ring-4 ring-pink-50 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:border-b-0 transition-all">
            <HelpCircle size={28} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-pink-500 mb-8 text-center drop-shadow-sm tracking-wide" style={{ textShadow: '2px 2px 0px white' }}>Phân Số Bằng Nhau</h2>
      
      {/* Khung chính được làm gọn lại */}
      <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] shadow-xl backdrop-blur-md w-full border-4 border-white flex flex-col gap-6 ring-4 ring-pink-100">
        
        {/* 1. THANH CÔNG CỤ ĐIỀU KHIỂN - Đặt ngang hàng */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full bg-white rounded-[2rem] p-6 shadow-[0_8px_0_rgba(0,0,0,0.05)] border-2 border-pink-50">
            
            {/* Nhập phân số */}
            <div className="flex items-center gap-3 bg-pink-50 px-4 py-3 rounded-2xl border-b-4 border-pink-200 shadow-inner">
               <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Gốc:</span>
               <div className="flex flex-col gap-1 w-16">
                  <input 
                    type="number" 
                    min="0"
                    onKeyDown={(e) => e.key === '-' && e.preventDefault()}
                    value={baseNum} 
                    onChange={(e) => setBaseNum(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center font-black text-xl text-blue-600 bg-white rounded-lg h-8 border-b-2 border-transparent focus:border-blue-300 outline-none shadow-sm"
                  />
                  <div className="h-0.5 bg-pink-300 w-full opacity-50"></div>
                  <input 
                    type="number" 
                    min="1"
                    onKeyDown={(e) => e.key === '-' && e.preventDefault()}
                    value={baseDenom} 
                    onChange={(e) => setBaseDenom(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center font-black text-xl text-pink-600 bg-white rounded-lg h-8 border-b-2 border-transparent focus:border-pink-300 outline-none shadow-sm"
                  />
               </div>
            </div>

            {/* Chọn phép tính */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
               <div className="flex gap-2">
                  <button onClick={() => setOperation('multiply')} className={`p-3 rounded-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${operation === 'multiply' ? 'bg-white shadow-[0_4px_0_rgba(0,0,0,0.1)] border-purple-200 text-purple-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}><Multiply size={24} strokeWidth={3}/></button>
                  <button onClick={() => setOperation('divide')} className={`p-3 rounded-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${operation === 'divide' ? 'bg-white shadow-[0_4px_0_rgba(0,0,0,0.1)] border-pink-200 text-pink-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}><Divide size={24} strokeWidth={3}/></button>
               </div>
               <div className="w-0.5 h-10 bg-slate-200"></div>
               <div className="flex items-center gap-2">
                  <button onClick={() => setFactor(Math.max(2, factor-1))} className="w-10 h-10 bg-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-4 border-slate-200 text-slate-500 font-bold hover:text-purple-500 hover:bg-purple-50 active:shadow-none active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl transition-all">-</button>
                  <span className="font-black text-2xl text-slate-600 w-8 text-center">{factor}</span>
                  <button onClick={() => setFactor(Math.min(10, factor+1))} className="w-10 h-10 bg-white rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-4 border-slate-200 text-slate-500 font-bold hover:text-purple-500 hover:bg-purple-50 active:shadow-none active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl transition-all">+</button>
               </div>
            </div>

            {/* Nút ẩn hiện kết quả */}
            <button 
              onClick={() => setShowResult(!showResult)}
              className={`p-3 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${showResult ? 'bg-purple-100 text-purple-600 border-purple-300 shadow-[0_4px_0_#d8b4fe]' : 'bg-slate-100 text-slate-400 border-slate-300 shadow-[0_4px_0_#cbd5e1]'}`}
            >
               {showResult ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
        </div>

        {/* 2. KHU VỰC HIỂN THỊ TRỰC QUAN - Tận dụng tối đa không gian */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center w-full min-h-[360px]">
           
           {/* Card Trái: Gốc */}
           <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_0_#e2e8f0] border-2 border-slate-100 flex flex-col items-center gap-6 h-full justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-3 bg-teal-400"></div>
              <div className="transform transition-transform group-hover:scale-105 duration-300">
                 <PieVisual numerator={baseNum} denominator={baseDenom} size={200} color="#4ECDC4" />
              </div>
              <div className="scale-90 bg-teal-50 px-6 py-2 rounded-2xl border-2 border-teal-100">
                 <FractionDisplay numerator={baseNum} denominator={baseDenom} size="text-5xl" color="text-teal-500" />
              </div>
           </div>

           {/* Mũi tên chỉ hướng */}
           <div className="flex flex-col items-center justify-center text-slate-300 z-10">
              <div className="bg-white px-4 py-1.5 rounded-full shadow-md border-b-4 border-slate-200 text-xs font-black mb-3 uppercase tracking-wide text-slate-500">
                 {operation === 'multiply' ? 'Nhân' : 'Chia'}
              </div>
              <ArrowRight size={48} strokeWidth={4} className={`filter drop-shadow-sm ${operation === 'multiply' ? 'text-purple-300' : 'text-pink-300'}`} />
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-2xl text-slate-500 shadow-md border-b-4 border-slate-200 mt-2">
                 {factor}
              </div>
           </div>

           {/* Card Phải: Kết quả */}
           <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_0_#e2e8f0] border-2 border-slate-100 flex flex-col items-center gap-6 h-full justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-red-400"></div>
              
              {isDivisible ? (
                 <>
                    <div className={`transform transition-all duration-500 ${showResult ? 'opacity-100 scale-100' : 'opacity-20 blur-sm scale-95'}`}>
                       <PieVisual numerator={eqNum} denominator={eqDenom} size={200} color="#FF6B6B" />
                    </div>
                    <div className={`scale-90 transition-all duration-300 bg-red-50 px-6 py-2 rounded-2xl border-2 border-red-100 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                       <FractionDisplay numerator={eqNum} denominator={eqDenom} color="text-red-500" size="text-5xl" />
                    </div>
                    {/* Dấu bằng trang trí */}
                    <div className="absolute top-4 right-4 bg-slate-50 p-2 rounded-full border border-slate-100">
                       <Equal size={24} className="text-slate-300" />
                    </div>
                 </>
              ) : (
                 <div className="flex flex-col items-center text-center opacity-50">
                    <XCircle size={64} className="text-red-300 mb-2 drop-shadow-sm" />
                    <span className="font-bold text-red-400">Không chia hết</span>
                 </div>
              )}
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

export default EquivalentModule;