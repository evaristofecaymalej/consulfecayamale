
import React from 'react';

const FaturfecaLogo: React.FC<{ className?: string, textColor?: string }> = ({ className, textColor = 'text-secondary' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#paint0_linear_401_2)"/>
            <path d="M10 9H15L22 23H17L10 9Z" fill="white" fillOpacity="0.5"/>
            <path d="M15 9H22V14L17 23H10V18L15 9Z" fill="white"/>
            <defs>
                <linearGradient id="paint0_linear_401_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0052CC"/>
                    <stop offset="1" stopColor="#00B8D9"/>
                </linearGradient>
            </defs>
        </svg>
        <span className={`text-2xl font-bold ${textColor}`}>Faturfeca</span>
    </div>
  );
};

export default FaturfecaLogo;
