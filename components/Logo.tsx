import React from 'react';

interface LogoProps {
  className?: string;
}

const RobikiLogo: React.FC<LogoProps> = ({ className }) => (
  <img 
    src="https://i.ibb.co/N2yNzRXZ/Roboki.png" 
    alt="Roboki Logo" 
    className={className}
    referrerPolicy="no-referrer"
  />
);

export default RobikiLogo;