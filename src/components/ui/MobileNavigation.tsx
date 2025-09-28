import React from 'react';
import { cn } from '@/utils/cn';
import { useIsMobile, useIsExtraSmall } from '@/hooks/useMediaQuery';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();

  if (!isMobile) {
    return null; // Component only for mobile
  }

  return (
    <div className={cn('bg-white/10 backdrop-blur-sm border-t border-white/20', className)}>
      {/* Bottom Navigation for Mobile - Enhanced */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-inset-bottom shadow-lg">
        <nav className="flex items-center justify-around py-3 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 touch-manipulation tap-highlight-transparent active:scale-95',
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
              )}
            >
              {tab.icon && (
                <span className={cn(
                  'transition-all duration-300 text-lg',
                  activeTab === tab.id ? 'scale-110' : 'scale-100'
                )}>
                  {tab.icon}
                </span>
              )}
              <span className={cn(
                'text-xs font-medium transition-all duration-300',
                isExtraSmall ? 'hidden' : 'block',
                activeTab === tab.id ? 'font-bold' : 'font-medium'
              )}>
                {isExtraSmall ? tab.label.charAt(0) : tab.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

/**
 * Mobile Tab Bar - Alternative horizontal scrolling version
 */
export const MobileTabBar: React.FC<MobileNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();

  return (
    <div className={cn('border-b border-white/20 bg-transparent', className)}>
      {/* Horizontal Scrolling Tabs */}
      <nav className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-2 p-2 -webkit-overflow-scrolling-touch">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-2 rounded-lg transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-fit touch-manipulation tap-highlight-transparent',
              activeTab === tab.id
                ? 'border-white text-white bg-white/20 backdrop-blur-sm shadow-lg scale-105'
                : 'border-transparent text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 active:bg-white/15 active:scale-95'
            )}
          >
            {tab.icon && (
              <span className="text-base flex-shrink-0">
                {tab.icon}
              </span>
            )}
            <span className={cn(
              'transition-all duration-200',
              isExtraSmall && isMobile ? 'hidden' : 'block'
            )}>
              {isExtraSmall ? tab.label.split(' ')[0] : tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

/**
 * Mobile-optimized Floating Action Button
 */
interface MobileFABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const MobileFAB: React.FC<MobileFABProps> = ({
  icon,
  onClick,
  label,
  className,
  variant = 'primary',
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white shadow-gray-500/30',
    accent: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/30',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 touch-manipulation tap-highlight-transparent active:scale-95',
        variantStyles[variant],
        className
      )}
      title={label}
    >
      <span className="text-lg">{icon}</span>
      {label && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
    </button>
  );
};

/**
 * Mobile Pull-to-Refresh Indicator
 */
interface PullToRefreshProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  isRefreshing,
  onRefresh,
  children,
  className,
}) => {
  const [startY, setStartY] = React.useState<number>(0);
  const [currentY, setCurrentY] = React.useState<number>(0);
  const [isPulling, setIsPulling] = React.useState<boolean>(false);

  const isMobile = useIsMobile();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0 && window.scrollY === 0) {
      setCurrentY(diff);
      setIsPulling(diff > 60);
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    if (isPulling && !isRefreshing) {
      onRefresh();
    }
    
    setCurrentY(0);
    setIsPulling(false);
    setStartY(0);
  };

  return (
    <div
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {currentY > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-50 border-b border-blue-200 transition-all duration-200 z-10"
          style={{ height: Math.min(currentY, 80) }}
        >
          <div className={cn(
            'flex items-center gap-2 text-blue-600 transition-all duration-200',
            isPulling ? 'scale-110' : 'scale-100'
          )}>
            <div className={cn(
              'w-5 h-5 border-2 border-blue-600 rounded-full transition-transform duration-200',
              isPulling ? 'animate-spin border-t-transparent' : ''
            )}></div>
            <span className="text-sm font-medium">
              {isPulling ? 'Solte para atualizar' : 'Puxe para atualizar'}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div style={{ transform: `translateY(${Math.min(currentY * 0.5, 40)}px)` }}>
        {children}
      </div>
    </div>
  );
};
