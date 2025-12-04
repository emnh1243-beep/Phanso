import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: string[];
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, title, steps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b-[12px] border-slate-200 ring-4 ring-white animate-bounce-short">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-400 border-b-4 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:border-b-0 active:translate-y-1 transition-all"
        >
          <X size={24} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-3xl text-blue-500 shadow-inner border-4 border-blue-50">
            <BookOpen size={40} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h3 className="text-2xl font-black text-slate-700 text-center uppercase tracking-wide">{title}</h3>
          
          <div className="w-full bg-slate-50 rounded-2xl p-4 border-2 border-slate-100 shadow-inner max-h-[50vh] overflow-y-auto custom-scrollbar">
            <ul className="space-y-4">
              {steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-slate-600 font-bold text-lg leading-snug items-start bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-[0_3px_0_rgba(0,0,0,0.2)] border-b-4 border-blue-600">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black text-lg shadow-[0_6px_0_#1e40af] border-b-4 border-blue-700 active:shadow-none active:border-b-0 active:translate-y-2 transition-all mt-4"
          >
            Đã Hiểu!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;