import React from 'react';

interface NeumorphismButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NeumorphismButton: React.FC<NeumorphismButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300
        bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200
        shadow-neumorphic-light dark:shadow-neumorphic-dark
        hover:shadow-neumorphic-light-hover dark:hover:shadow-neumorphic-dark-hover
        active:shadow-neumorphic-light-active dark:active:shadow-neumorphic-dark-active
        ${className || ''}`}
    >
      {children}
    </button>
  );
};