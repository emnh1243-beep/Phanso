import React from 'react';

interface LogoProps {
  className?: string;
}

const RobikiLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="8" />
    <rect x="45" y="55" width="110" height="90" rx="20" fill="white" stroke="#3B82F6" strokeWidth="6" />
    <path d="M 45 90 L 30 90 C 25 90 25 110 30 110 L 45 110" fill="#F472B6" stroke="#3B82F6" strokeWidth="6" />
    <path d="M 155 90 L 170 90 C 175 90 175 110 170 110 L 155 110" fill="#F472B6" stroke="#3B82F6" strokeWidth="6" />
    <line x1="100" y1="55" x2="100" y2="25" stroke="#3B82F6" strokeWidth="6" />
    <circle cx="100" cy="20" r="10" fill="#F472B6" stroke="#3B82F6" strokeWidth="3" />
    <ellipse cx="75" cy="90" rx="12" ry="15" fill="#3B82F6" />
    <ellipse cx="125" cy="90" rx="12" ry="15" fill="#3B82F6" />
    <circle cx="78" cy="86" r="4" fill="white" />
    <circle cx="128" cy="86" r="4" fill="white" />
    <path d="M 80 120 Q 100 135 120 120" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" />
    <circle cx="60" cy="105" r="6" fill="#F472B6" opacity="0.6" />
    <circle cx="140" cy="105" r="6" fill="#F472B6" opacity="0.6" />
  </svg>
);

export default RobikiLogo;