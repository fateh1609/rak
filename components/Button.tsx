import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gold-500 text-white hover:bg-gold-600 border border-transparent",
    secondary: "bg-deepblue-900 text-white hover:bg-deepblue-800 border border-transparent",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-deepblue-900"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};