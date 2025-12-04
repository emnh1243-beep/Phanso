import React from 'react';
import { Button3DProps } from '../types';

const Button3D: React.FC<Button3DProps> = ({ 
  onClick, 
  color, 
  icon: Icon, 
  label, 
  className = "", 
  disabled = false, 
  title,
  type = "button"
}) => {
  const baseColor = color || 'bg-white';
  const isWhite = baseColor === 'bg-white';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative group transition-all duration-150 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0.5'}
        ${className}
      `}
    >
      <div className={`
        ${baseColor} rounded-2xl px-6 py-3 font-black text-lg
        shadow-[0_4px_0_rgba(0,0,0,0.2)]
        group-hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]
        group-active:shadow-none
        flex items-center justify-center gap-2 
        border-t-4 border-white/30
        relative overflow-hidden
        ${isWhite ? 'text-slate-600' : 'text-white'}
      `}>
        {/* Lớp phủ bóng loáng */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="relative flex items-center gap-2 z-10">
          {Icon && <Icon size={24} strokeWidth={3} className="drop-shadow-sm" />}
          <span className="drop-shadow-sm">{label}</span>
        </div>
      </div>
    </button>
  );
};

export default Button3D;