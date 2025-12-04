import React from 'react';

// --- REALISTIC 3D PIZZA VISUAL (Extruded with Stacking) ---
interface PizzaVisualProps {
  numerator: number;
  denominator: number;
  size?: number;
  onSliceClick?: (index: number) => void;
  activeSlices: boolean[];
}

export const PizzaVisual: React.FC<PizzaVisualProps> = ({ numerator, denominator, size = 300, onSliceClick, activeSlices }) => {
  const radius = size / 2;
  const center = radius;
  const visualRadius = radius - 15; 
  
  const slices = [];
  const step = (2 * Math.PI) / denominator;
  const depth = 12; 

  const defs = (
    <defs>
      <radialGradient id="cheeseGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="30%" stopColor="#FDD835" /> 
        <stop offset="85%" stopColor="#FB8C00" /> 
        <stop offset="100%" stopColor="#E65100" /> 
      </radialGradient>
      
      <radialGradient id="inactiveGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FAFAFA" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </radialGradient>
    </defs>
  );

  for (let i = 0; i < denominator; i++) {
    const gap = denominator > 1 ? Math.min(0.04, 0.25 / denominator) : 0;
    const isWhole = denominator === 1;
    
    const startAngle = i * step - Math.PI / 2 + gap;
    const endAngle = (i + 1) * step - Math.PI / 2 - gap;
    
    const x1 = center + visualRadius * Math.cos(startAngle);
    const y1 = center + visualRadius * Math.sin(startAngle);
    const x2 = center + visualRadius * Math.cos(endAngle);
    const y2 = center + visualRadius * Math.sin(endAngle);
    
    const pathData = isWhole
      ? `M ${center},${center - visualRadius} A ${visualRadius},${visualRadius} 0 1,1 ${center},${center + visualRadius} A ${visualRadius},${visualRadius} 0 1,1 ${center},${center - visualRadius} Z`
      : `M ${center},${center} L ${x1},${y1} A ${visualRadius},${visualRadius} 0 0,1 ${x2},${y2} Z`;

    const isActive = activeSlices ? activeSlices[i] : i < numerator;
    
    const midAngle = isWhole ? -Math.PI / 2 : (startAngle + endAngle) / 2;
    const p1x = center + (visualRadius * 0.5) * Math.cos(midAngle);
    const p1y = center + (visualRadius * 0.5) * Math.sin(midAngle);
    
    if (isActive) {
      const layers = [];
      for (let d = depth; d >= 0; d--) {
        const isTop = d === 0;
        layers.push(
          <path
            key={`layer-${d}`}
            d={pathData}
            fill={isTop ? "url(#cheeseGradient)" : (d > depth - 4 ? "#BF360C" : "#E65100")} 
            transform={`translate(0, ${d})`}
            stroke={isTop ? "#FFF8E1" : "none"}
            strokeWidth={isTop ? (isWhole ? 4 : 2) : 0} 
          />
        );
      }

      slices.push(
        <g 
          key={i} 
          onClick={() => onSliceClick && onSliceClick(i)}
          className="cursor-pointer transition-transform duration-200 hover:-translate-y-2"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <g>{layers}</g>
          
          <g transform={`translate(0, 0)`}>
             <circle cx={p1x} cy={p1y} r={visualRadius * 0.08} fill="#D32F2F" opacity="0.9" />
             <circle cx={p1x-2} cy={p1y-2} r={visualRadius * 0.02} fill="#FFCCBC" opacity="0.6" />
             {(denominator < 8 || isWhole) && (
                <circle cx={center + (visualRadius * 0.75) * Math.cos(midAngle - 0.5)} cy={center + (visualRadius * 0.75) * Math.sin(midAngle - 0.5)} r={visualRadius * 0.06} fill="#D32F2F" opacity="0.9" />
             )}
             {isWhole && (
                <circle cx={center} cy={center} r={visualRadius * 0.05} fill="#D32F2F" opacity="0.9" />
             )}
          </g>
        </g>
      );
    } else {
      slices.push(
        <g 
          key={i} 
          onClick={() => onSliceClick && onSliceClick(i)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          <path 
            d={pathData} 
            fill="url(#inactiveGradient)" 
            stroke="#BDBDBD" 
            strokeWidth="1" 
            strokeDasharray={isWhole ? "0" : "4 4"} 
            transform={`translate(0, ${depth})`} 
          />
          {!isWhole && (
            <text 
              x={center + (visualRadius * 0.8) * Math.cos(midAngle)} 
              y={center + (visualRadius * 0.8) * Math.sin(midAngle) + depth} 
              textAnchor="middle" 
              dy="0.3em" 
              className="text-sm font-bold fill-slate-500 select-none"
            >
              {i+1}
            </text>
          )}
        </g>
      );
    }
  }

  return (
    <div className="relative p-4" style={{ width: size + 20, height: size + depth + 40 }}>
      <svg width={size} height={size + depth + 20} viewBox={`0 0 ${size} ${size + depth + 20}`} className="overflow-visible drop-shadow-xl">
        {defs}
        {slices}
      </svg>
    </div>
  );
};

interface SimpleVisualProps {
  numerator: number;
  denominator: number;
  color?: string;
  size?: number;
}

export const PieVisual: React.FC<SimpleVisualProps> = ({ numerator, denominator, color = "#FF4757", size = 200 }) => {
  const radius = size / 2;
  const center = radius;
  const slices = [];
  const step = (2 * Math.PI) / denominator;
  const gradientId = `pie-grad-${numerator}-${denominator}-${size}-${Math.random().toString(36).substr(2, 9)}`;

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * step - Math.PI / 2;
    const endAngle = (i + 1) * step - Math.PI / 2;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const pathData = denominator === 1 
      ? `M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
      : `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;

    const isActive = i < numerator;
    
    slices.push(
      <path 
        key={i} 
        d={pathData} 
        fill={isActive ? `url(#${gradientId})` : '#F1F5F9'} 
        stroke="white" 
        strokeWidth="2" 
        className="transition-all duration-300 hover:brightness-110"
        style={{ filter: isActive ? 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' : 'none' }}
      />
    );
  }

  return (
    <div className="relative drop-shadow-xl rounded-full" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id={`${gradientId}-highlight`} cx="30%" cy="30%" r="50%">
             <stop offset="0%" stopColor="white" stopOpacity="0.4" />
             <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        {slices}
        <circle cx={size/2} cy={size/2} r={size/2} fill={`url(#${gradientId}-highlight)`} pointerEvents="none" />
      </svg>
    </div>
  );
};

export const RectVisual: React.FC<SimpleVisualProps> = ({ numerator, denominator, color = "#FF4757", size = 200 }) => {
  const width = size;
  const height = size;
  const partWidth = width / denominator;
  const slices = [];
  const gradientId = `rect-grad-${numerator}-${denominator}-${size}`;

  for (let i = 0; i < denominator; i++) {
    const isActive = i < numerator;
    slices.push(
      <rect
        key={i}
        x={i * partWidth}
        y={0}
        width={partWidth}
        height={height}
        fill={isActive ? `url(#${gradientId})` : '#F1F5F9'}
        stroke="white"
        strokeWidth="2"
        className="transition-all duration-300 hover:brightness-110"
      />
    );
  }

  return (
    <div className="relative drop-shadow-xl rounded-xl overflow-hidden bg-white ring-4 ring-white" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {slices}
      </svg>
    </div>
  );
};