import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-[16px] border border-[#E6E8EC] shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}