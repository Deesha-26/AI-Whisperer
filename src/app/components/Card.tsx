import React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[16px] border border-[#E6E8EC] bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}