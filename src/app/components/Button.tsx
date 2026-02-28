import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#4C7DFF] text-white hover:bg-[#3D6EEE] active:bg-[#2E5FDD] shadow-[0_12px_30px_rgba(76,125,255,0.35)] hover:shadow-[0_14px_35px_rgba(76,125,255,0.4)]',
    secondary: 'bg-white text-[#111318] border-2 border-[#E6E8EC] hover:border-[#4C7DFF] hover:bg-[#F7F8FA]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-sm'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}