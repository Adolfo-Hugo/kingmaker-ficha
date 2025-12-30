
import React from 'react';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  badgeColor?: string;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({ children, className = "", badge, badgeColor = "bg-black" }) => (
  <div className={`bg-white dark:bg-surface-dark border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-brutal-white relative ${className}`}>
    {badge && (
      <div className={`absolute -top-3 -right-3 ${badgeColor} text-white px-2 py-1 text-xs font-bold uppercase border-2 border-black dark:border-white`}>
        {badge}
      </div>
    )}
    {children}
  </div>
);

export const BrutalButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'outline' }> = ({ children, className = "", variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary",
    danger: "bg-red-700 text-white hover:bg-red-800",
    outline: "bg-white dark:bg-transparent text-black dark:text-white border-black dark:border-white"
  };
  
  return (
    <button 
      className={`border-2 border-black dark:border-white px-4 py-2 font-bold uppercase tracking-wider shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const BrutalInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input 
    className={`w-full bg-transparent border-b-4 border-black dark:border-white focus:border-primary focus:ring-0 text-lg font-bold p-2 dark:text-white placeholder-gray-400 ${className}`}
    {...props}
  />
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h2 className={`text-xl font-display font-black bg-primary text-white px-4 py-2 mb-6 inline-block border-2 border-black dark:border-white uppercase tracking-wider ${className}`}>
    {children}
  </h2>
);
