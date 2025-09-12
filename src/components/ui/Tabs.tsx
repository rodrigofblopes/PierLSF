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
      {/* Mobile Navigation - Horizontal Scroll */}
      <nav className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-4 lg:space-x-8 pb-2 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-medium border-b-2 transition-all duration-300 rounded-t-lg whitespace-nowrap flex-shrink-0 min-w-fit',
              activeTab === tab.id
                ? 'border-white text-white bg-white/20 backdrop-blur-sm shadow-lg'
                : 'border-transparent text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 active:bg-white/15'
            )}
          >
            {tab.icon && (
              <span className="text-base sm:text-lg lg:text-xl flex-shrink-0">
                {tab.icon}
              </span>
            )}
            {/* Mobile: Show only icon for very small screens, otherwise show full label */}
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
            {/* Extra small screens: only icon */}
            <span className="xs:hidden sm:hidden text-xs">{tab.label.charAt(0)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
