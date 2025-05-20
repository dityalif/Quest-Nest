import React, { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';

const LoadingSpinner = ({ size = 'medium' }) => {
  const { darkMode } = useContext(ThemeContext);
  
  // Define sizes in pixels
  const sizes = {
    small: { width: 24, height: 24 },
    medium: { width: 32, height: 32 },
    large: { width: 48, height: 48 }
  };
  
  const { width, height } = sizes[size] || sizes.medium;
  
  // Get theme color based on dark mode status
  const outlineColor = darkMode ? 'var(--color-primary)' : 'var(--color-primary)';
  
  return (
    <div className="animate-spin flex justify-center items-center" style={{ width, height }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={outlineColor} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-swords-icon"
      >
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
        <line x1="13" x2="19" y1="19" y2="13"/>
        <line x1="16" x2="20" y1="16" y2="20"/>
        <line x1="19" x2="21" y1="21" y2="19"/>
        <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
        <line x1="5" x2="9" y1="14" y2="18"/>
        <line x1="7" x2="4" y1="17" y2="20"/>
        <line x1="3" x2="5" y1="19" y2="21"/>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
