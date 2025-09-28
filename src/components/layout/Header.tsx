import React from 'react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
  return (
    <header className={cn('glass-primary p-2 sm:p-4 rounded-xl border border-primary-500/20', className)}>
      <div className="flex items-center justify-center">
        <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl text-center">
          Flutuante LSF
        </h1>
      </div>
    </header>
  );
};
