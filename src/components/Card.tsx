import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div 
      className={`glass-card ${className}`} 
      onClick={onClick}
      style={{
        ...style,
        ...(onClick ? { cursor: 'pointer' } : undefined)
      }}
    >
      {children}
    </div>
  );
};
