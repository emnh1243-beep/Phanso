import React, { useState } from 'react';
import { Home, PieChart, Copy, Scissors, Gamepad2, Trophy, Phone, User } from 'lucide-react';
import ConceptModule from './modules/ConceptModule';
import EquivalentModule from './modules/EquivalentModule';
import SimplifyModule from './modules/SimplifyModule';
import PracticeModule from './modules/PracticeModule';
import AchievementsModule from './modules/AchievementsModule';
import MenuCard from './components/MenuCard';
import Button3D from './components/Button3D';
import RobikiLogo from './components/Logo';
import { COLORS } from './constants';

export default function App() {
  const [view, setView] = useState<'home' | 'concept' | 'equivalent' | 'simplify' | 'practice' | 'achievements'>('home'); 

  const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F0F4F8]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFEAA7] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#74B9FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-[#55EFC4] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
    </div>
  );

  const renderView = () => {
    switch(view) {
      case 'concept': return <ConceptModule onBack={() => setView('home')} />;
      case 'equivalent': return <EquivalentModule onBack={() => setView('home')} />;
      case 'simplify': return <SimplifyModule onBack={() => setView('home')} />;
      case 'practice': return <PracticeModule onBack={() => setView('home')} />;
      case 'achievements': return <AchievementsModule onBack={() => setView('home')} />;
      default: return (
        <div className="flex flex-col items-center gap-2 animate-fade-in max-w-6xl mx-auto pb-8">
          <header className="text-center mb-0 relative w-full flex flex-col items-center -mt-4 md:-mt-8">
            
            {/* Title & Logo Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <div className="animate-float drop-shadow-2xl">
                 <RobikiLogo className="w-28 h-48 md:w-36 md:h-64 object-contain" />
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#A29BFE] drop-shadow-sm p-0 tracking-tight" style={{WebkitTextStroke: '2px white'}}>
                Phân Số Diệu Kì
              </h1>
            </div>

            {/* Refactored Author Info */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-2 bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/60 shadow-sm animate-fade-in">
               <div className="flex items-center gap-2 text-slate-600 font-bold text-sm md:text-lg">
                 <User size={18} className="text-blue-500" />
                 <span>Tác giả: <span className="text-slate-800">Nguyễn Hoàng Em</span></span>
               </div>
               <div className="hidden md:block w-px h-4 bg-slate-300"></div>
               <div className="flex items-center gap-2 text-slate-600 font-bold text-sm md:text-lg">
                 <Phone size={18} className="text-green-500" />
                 <span>Điện thoại: <span className="text-slate-800">0933 474 843</span></span>
               </div>
            </div>

            <p className="text-slate-500 text-xl md:text-2xl font-black mt-4 tracking-widest uppercase opacity-80">Khám phá thế giới phân số</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-4xl px-4"> 
            <MenuCard title="Khái Niệm Phân Số" desc="Phân số là gì nhỉ?" icon={PieChart} color={COLORS.primary} onClick={() => { setView('concept'); }} />
            <MenuCard title="Phân Số Bằng Nhau" desc="Biến hóa phân số" icon={Copy} color={COLORS.secondary} onClick={() => { setView('equivalent'); }} />
            <MenuCard title="Rút Gọn Phân Số" desc="Làm gọn phân số" icon={Scissors} color={COLORS.success} onClick={() => { setView('simplify'); }} />
            <MenuCard title="Luyện Tập" desc="Thử tài của em" icon={Gamepad2} color={COLORS.accent} onClick={() => { setView('practice'); }} />
            {/* New Achievements Card - Spanning full width on mobile or fitting grid */}
            <div className="md:col-span-2 lg:col-span-2">
              <MenuCard title="Bảng Thành Tích" desc="Xem lại điểm số xuất sắc" icon={Trophy} color={COLORS.orange} onClick={() => { setView('achievements'); }} />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 p-0 md:p-2 relative selection:bg-pink-200">
      <Background />
      
      {view !== 'home' && (
        <div className="absolute top-4 left-4 z-50">
           <Button3D onClick={() => setView('home')} color="bg-white" icon={Home} label="Trang chủ" className="text-slate-500 hover:text-blue-500" />
        </div>
      )}
      <main className="container mx-auto mt-0">
        {renderView()}
      </main>
      <div className="fixed bottom-4 right-4 text-slate-400 text-sm font-bold opacity-50 pointer-events-none">AI Teacher Math App © 2024</div>
    </div>
  );
}