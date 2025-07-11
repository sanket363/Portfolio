import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 ${className || ''}`}
    >
      {children}
    </div>
  );
};