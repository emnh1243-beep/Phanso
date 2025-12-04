import React from 'react';
import { LucideIcon, Play } from 'lucide-react';

interface MenuCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, desc, icon: Icon, color, onClick }) => {
  return (
    <button onClick={onClick} className="group relative w-full transform transition-all hover:-translate-y-2 active:translate-y-1 focus:outline-none">
      <div className={`${color} h-52 rounded-[2.5rem] p-8 text-white text-left shadow-[0_15px_0_rgba(0,0,0,0.1)] active:shadow-none border-b-8 border-black/10 flex flex-col justify-between overflow-hidden relative ring-4 ring-white group-hover:brightness-105 transition-all`}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="z-10 relative">
          <h3 className="text-3xl font-black mb-2 tracking-tight drop-shadow-md text-white" style={{ textShadow: '0 2px 0 rgba(0,0,0,0.1)' }}>{title}</h3>
          <p className="font-bold opacity-90 text-lg drop-shadow-sm">{desc}</p>
        </div>
        <div className="absolute -right-6 -bottom-6 bg-white/20 p-10 rounded-full transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 backdrop-blur-sm border-2 border-white/10">
           <Icon size={72} className="text-white drop-shadow-lg" />
        </div>
        <div className="absolute top-6 right-6 p-3 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-md shadow-inner border border-white/30">
           <Play fill="white" size={24} className="drop-shadow-sm" />
        </div>
      </div>
    </button>
  );
};

export default MenuCard;