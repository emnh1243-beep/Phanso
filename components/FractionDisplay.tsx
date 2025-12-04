import React from 'react';

interface FractionDisplayProps {
  numerator: number | string | null;
  denominator: number | string | null;
  size?: string;
  color?: string;
  denomColor?: string;
  isEmpty?: boolean;
  className?: string;
}

const FractionDisplay: React.FC<FractionDisplayProps> = ({ 
  numerator, 
  denominator, 
  size = "text-4xl", 
  color = "text-blue-600", 
  denomColor, 
  isEmpty = false, 
  className="" 
}) => {
  if (isEmpty) {
    return (
      <div className={`flex flex-col items-center justify-center font-black ${size} text-slate-300 bg-slate-100/50 p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-2 border-dashed border-slate-300 ${className}`}>
        <div className="w-10 h-10 rounded border-2 border-dashed border-slate-300 mb-1 opacity-50"></div>
        <div className="w-full h-1.5 bg-slate-300 rounded-full opacity-50"></div>
        <div className="w-10 h-10 rounded border-2 border-dashed border-slate-300 mt-1 opacity-50"></div>
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center justify-center font-black ${size} ${color} bg-white p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.1)] ring-4 ring-white/50 backdrop-blur-sm transform transition-transform hover:scale-105 ${className}`}>
      <span className="mb-1 drop-shadow-sm">{numerator}</span>
      <div className="w-full h-1.5 bg-current rounded-full opacity-80 my-1"></div>
      <span className={`mt-1 drop-shadow-sm ${denomColor ? denomColor : ''}`}>{denominator}</span>
    </div>
  );
};

export default FractionDisplay;