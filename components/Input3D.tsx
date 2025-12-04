import React from 'react';

interface Input3DProps {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

const Input3D: React.FC<Input3DProps> = ({ value, onChange, placeholder, className = "", type="number" }) => {
  return (
    <div className={`relative group ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full bg-white rounded-xl px-4 py-2 font-black text-2xl text-center text-slate-700 outline-none border-b-4 border-slate-200 shadow-md focus:border-indigo-400 focus:shadow-indigo-100 transition-all placeholder:text-slate-300"
      />
    </div>
  );
};

export default Input3D;