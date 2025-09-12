import React from 'react';
import { cn } from '@/utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-white/20', className)}>
      <nav className="flex space-x-1 sm:space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium border-b-2 transition-all duration-300 rounded-t-lg',
              activeTab === tab.id
                ? 'border-white text-white bg-white/20 backdrop-blur-sm shadow-lg'
                : 'border-transparent text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10'
            )}
          >
            {tab.icon && (
              <span className="text-lg sm:text-xl">
                {tab.icon}
              </span>
            )}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
