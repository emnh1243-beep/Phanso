
import React, { useState, useEffect } from 'react';
import { Dices, Pencil, Lightbulb, X, Check, Scissors, RotateCcw, ArrowRight, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { gcd } from '../utils';
import { PieVisual } from '../components/Visuals';
import FractionDisplay from '../components/FractionDisplay';
import Input3D from '../components/Input3D';
import Button3D from '../components/Button3D';
import GuideModal from '../components/GuideModal';
import { COLORS } from '../constants';

interface SimplifyModuleProps {
  onBack: () => void;
}

const SimplifyModule: React.FC<SimplifyModuleProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'random' | 'custom'>('random'); 
  const [numerator, setNumerator] = useState(8);
  const [denominator, setDenominator] = useState(12);
  const [showHint, setShowHint] = useState(false); 
  const [result, setResult] = useState<{n: number, d: number} | null>(null); 
  const [showResult, setShowResult] = useState(false); 
  const [showOriginal, setShowOriginal] = useState(false); 
  const [showGuide, setShowGuide] = useState(false);

  const commonDivisor = gcd(numerator, denominator);
  const isSimplified = commonDivisor === 1;

  useEffect(() => {
    setResult(null);
    setShowResult(false); 
    setShowOriginal(false); 
  }, [numerator, denominator]);

  const handleSimplify = () => {
    if (isSimplified) { return; }
    setResult({
      n: numerator / commonDivisor,
      d: denominator / commonDivisor
    });
    setShowHint(false);
  };

  const handleReset = () => {
    const newNum = Math.floor(Math.random() * 10 + 2) * 2; 
    const newDenom = newNum * Math.floor(Math.random() * 3 + 2);
    setNumerator(newNum);
    setDenominator(newDenom);
    setShowHint(false);
    setResult(null);
    setMode('random');
  };

  const handleCustomInput = (type: 'n' | 'd', val: string) => {
    const numVal = parseInt(val) || 0;
    if (type === 'n') setNumerator(numVal);
    if (type === 'd') setDenominator(numVal === 0 ? 1 : numVal); 
    setShowHint(false);
  };

  const guideSteps = [
    "Em chọn 'Ngẫu nhiên' để máy tự ra đề bài hoặc 'Tự nhập' để nhập phân số của mình.",
    "Em bấm nút 'Rút gọn' để máy tính tìm ra phân số tối giản nhất.",
    "Em bấm 'Cần trợ giúp?' nếu chưa biết nên chia cho số nào.",
    "Em quan sát 2 hình vẽ để thấy phân số rút gọn vẫn bằng phân số ban đầu."
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto animate-fade-in relative">
      <div className="absolute top-0 right-0 md:-right-16 z-20">
        <button 
          onClick={() => setShowGuide(true)} 
          className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-95" 
          title="Hướng dẫn"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-green-500 border-b-4 border-slate-200 ring-4 ring-green-50 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:border-b-0 transition-all">
            <HelpCircle size={28} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-green-500 mb-8 text-center drop-shadow-sm tracking-wide" style={{ textShadow: '2px 2px 0px white' }}>Rút Gọn Phân Số</h2>
      <div className="bg-white/60 p-8 rounded-[3rem] shadow-xl backdrop-blur-md w-full border-4 border-white flex flex-col gap-8 ring-4 ring-green-50 transition-all duration-300">
        
        {/* TOP CONTROLS */}
        <div className="flex justify-center gap-4 bg-white/50 p-2 rounded-3xl inline-flex self-center">
           <button 
             onClick={handleReset}
             className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${mode==='random' ? 'bg-green-500 border-green-700 text-white shadow-lg shadow-green-200' : 'bg-white text-slate-400 border-slate-200 hover:border-green-300'}`}
           >
             <Dices size={20} /> Ngẫu nhiên
           </button>
           <button 
             onClick={() => { setMode('custom'); }}
             className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${mode==='custom' ? 'bg-blue-500 border-blue-700 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'}`}
           >
             <Pencil size={20} /> Tự nhập
           </button>
        </div>

        {/* MAIN GRID LAYOUT - 3 CỘT CỐ ĐỊNH - Tăng chiều cao tối thiểu */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center w-full min-h-[500px]">
          
          {/* LEFT CARD: ORIGINAL (Luôn hiển thị - Cố định kích thước) */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_12px_0_#e2e8f0] border-2 border-blue-50 flex flex-col items-center h-full min-h-[480px] justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-blue-300"></div>
            <div className="w-full flex justify-center items-center h-8 mb-2 z-10">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">Phân số gốc</span>
            </div>
            
            {/* Container Hình - Tăng height để tránh đè lên chữ */}
            <div className="h-[250px] flex items-center justify-center w-full mb-2">
              <div className="transform scale-110 transition-transform duration-500"> 
                 {denominator <= 36 ? (
                   <PieVisual numerator={numerator} denominator={denominator} size={200} color={"#FF6B6B"} />
                 ) : (
                   <div className="w-[200px] h-[200px] rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200 text-slate-400 font-bold text-center p-4">
                     Số lớn quá<br/>không vẽ được bánh! 🍰
                   </div>
                 )}
              </div>
            </div>
               
            {/* Container Số - Tăng height và khoảng cách */}
            <div className="h-[120px] w-full flex items-center justify-center relative mt-4">
                 {mode === 'random' ? (
                    <>
                       <div className={`transition-all duration-500 transform absolute ${showOriginal ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                         <FractionDisplay numerator={numerator} denominator={denominator} size="text-6xl" color={isSimplified ? "text-green-500" : "text-red-500"} />
                       </div>
                       <div className={`absolute flex items-center justify-center transition-all duration-500 transform ${!showOriginal ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                          <div className="w-20 h-20 bg-slate-100 rounded-xl border-4 border-dashed border-slate-300 flex items-center justify-center">
                            <span className="text-4xl font-black text-slate-300">?</span>
                          </div>
                       </div>
                       <button 
                          onClick={() => setShowOriginal(!showOriginal)}
                          className="absolute -right-4 top-1/2 -translate-y-1/2 p-4 bg-white text-slate-400 hover:text-blue-500 rounded-full border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95 transition-all z-20 shadow-md"
                          title={showOriginal ? "Ẩn phân số gốc" : "Hiện phân số gốc"}
                       >
                          {showOriginal ? <EyeOff size={24} /> : <Eye size={24} />}
                       </button>
                    </>
                 ) : (
                   <div className="flex flex-col items-center gap-1">
                      <Input3D value={numerator} onChange={(e) => handleCustomInput('n', e.target.value)} placeholder="Tử" className="w-24 h-12 text-2xl" />
                      <div className="w-24 h-1.5 bg-slate-300 rounded-full my-1"></div>
                      <Input3D value={denominator} onChange={(e) => handleCustomInput('d', e.target.value)} placeholder="Mẫu" className="w-24 h-12 text-2xl" />
                   </div>
                 )}
            </div>
          </div>

          {/* CENTER: ACTION AREA */}
          <div className="flex flex-col items-center justify-center gap-6 z-10 h-full">
             <Button3D 
               onClick={handleSimplify} 
               color={result || isSimplified ? "bg-slate-200 text-slate-400" : COLORS.primary} 
               icon={result || isSimplified ? Check : Scissors} 
               label={result || isSimplified ? "Đã rút gọn" : "Rút gọn"} 
               disabled={!!result || isSimplified}
               className={result || isSimplified ? "cursor-default transform-none" : ""}
             />
             
             {/* Mũi tên luôn chiếm chỗ để tránh layout shift, chỉ ẩn hiện bằng opacity */}
             <div className={`flex flex-col items-center text-green-500 transition-opacity duration-500 ${result ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-xs font-bold text-slate-400 uppercase mb-1">Chia cả 2 cho</span>
                <div className="bg-green-50 px-5 py-3 rounded-2xl border-b-4 border-green-200 font-black text-2xl shadow-sm">
                  {commonDivisor}
                </div>
                <ArrowRight size={40} strokeWidth={4} className="mt-2 text-green-400 drop-shadow-sm" />
             </div>
          </div>

          {/* RIGHT CARD: RESULT (Khung cố định) */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_12px_0_#e2e8f0] border-2 border-green-50 flex flex-col items-center h-full min-h-[480px] justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-3 bg-green-400"></div>
             <div className="w-full flex justify-center items-center h-8 mb-2 z-10">
               <span className="text-xs font-black text-green-500 uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-full border border-green-200">Kết quả tối giản</span>
             </div>
             
             {/* Container Hình - Tăng height */}
             <div className="h-[250px] flex items-center justify-center w-full mb-2">
               {result ? (
                  <div className="transition-all duration-500 transform scale-110 animate-fade-in">
                    <PieVisual numerator={result.n} denominator={result.d} size={200} color="#4ADE80" />
                  </div>
               ) : (
                  <div className="w-[200px] h-[200px] rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center opacity-50">
                     <span className="text-slate-300 font-bold text-sm text-center px-4">Kết quả sẽ hiện ở đây</span>
                  </div>
               )}
             </div>

             {/* Container Số - Tăng height và khoảng cách */}
             <div className="h-[120px] w-full flex items-center justify-center relative mt-4">
                {result ? (
                  <>
                     <div className={`transition-all duration-500 transform absolute ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                        <FractionDisplay numerator={result.n} denominator={result.d} size="text-6xl" color="text-green-600" />
                     </div>
                     
                     <div className={`absolute flex items-center justify-center transition-all duration-500 transform ${!showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                         <div className="w-20 h-20 bg-slate-100 rounded-xl border-4 border-dashed border-slate-300 flex items-center justify-center">
                           <span className="text-4xl font-black text-slate-300">?</span>
                         </div>
                     </div>

                     <button 
                         onClick={() => setShowResult(!showResult)}
                         className="absolute -right-4 top-1/2 -translate-y-1/2 p-4 bg-white text-slate-400 hover:text-green-600 rounded-full border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 active:scale-95 transition-all shadow-md z-20"
                         title={showResult ? "Ẩn kết quả" : "Hiện kết quả"}
                     >
                         {showResult ? <EyeOff size={24} /> : <Eye size={24} />}
                     </button>
                  </>
                ) : (
                  <div className="w-24 h-16 border-2 border-dashed border-slate-200 rounded-xl opacity-50"></div>
                )}
             </div>

             <div className="absolute bottom-2 right-2">
                 <Button3D onClick={handleReset} color={COLORS.purple} icon={RotateCcw} label="" className="scale-75 origin-bottom-right" title="Bài mới" />
             </div>
          </div>
        </div>
        
        {/* Hints Area - Fixed height container to prevent layout jump */}
        <div className="flex justify-center items-center h-16 w-full transition-all">
          {!isSimplified && !result && (
            !showHint ? (
              <button onClick={() => { setShowHint(true); }} className="text-yellow-600 font-bold hover:text-yellow-700 text-sm flex items-center gap-2 bg-yellow-300 px-6 py-3 rounded-full transition-all shadow-[0_4px_0_#d97706] hover:brightness-110 active:shadow-none active:translate-y-1 border-2 border-yellow-400">
                 <Lightbulb size={20} fill="currentColor" className="text-yellow-100" /> Cần trợ giúp?
              </button>
            ) : (
              <div className="bg-yellow-50 px-6 py-3 rounded-2xl border-b-4 border-yellow-200 text-yellow-800 font-bold text-sm animate-fade-in flex items-center gap-3 shadow-md">
                <Lightbulb size={24} className="text-yellow-500 fill-yellow-500" />
                <span>💡 Gợi ý: Cả tử và mẫu đều chia hết cho <span className="text-xl font-black mx-1">{commonDivisor}</span></span>
                <button onClick={() => setShowHint(false)} className="ml-4 hover:bg-yellow-200 p-2 rounded-xl text-yellow-600 transition-colors"><X size={18} strokeWidth={3}/></button>
              </div>
            )
          )}
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

export default SimplifyModule;
