
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white';
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
    primary: "bg-gold-500 text-white hover:bg-gold-600 border border-transparent shadow-gold-500/20",
    secondary: "bg-deepblue-900 text-white hover:bg-deepblue-800 border border-transparent shadow-deepblue-900/20",
    // Default outline: Charcoal text/border, Gold on hover (For light backgrounds)
    outline: "bg-white border border-gray-800 text-gray-800 hover:border-gold-500 hover:text-gold-500 shadow-sm",
    // White outline: White text/border (For dark backgrounds)
    "outline-white": "bg-transparent border-2 border-white text-white hover:bg-white hover:text-deepblue-900 shadow-none"
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
