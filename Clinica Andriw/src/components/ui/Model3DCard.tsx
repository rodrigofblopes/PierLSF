import React from 'react';
import { Building2, Zap, Eye, Download, Star, Layers } from 'lucide-react';
import { ModelInfo } from '@/types';
import { cn } from '@/utils/cn';

interface Model3DCardProps {
  model: ModelInfo;
  isSelected: boolean;
  onSelect: () => void;
  onDownload?: () => void;
  className?: string;
}

export const Model3DCard: React.FC<Model3DCardProps> = ({
  model,
  isSelected,
  onSelect,
  onDownload,
  className,
}) => {
  const getIcon = () => {
    if (model.name.toLowerCase().includes('eletrico') || model.name.toLowerCase().includes('elétrico')) {
      return <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />;
    }
    return <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />;
  };

  const getGradientColors = () => {
    if (model.name.toLowerCase().includes('eletrico') || model.name.toLowerCase().includes('elétrico')) {
      return {
        card: 'from-yellow-400 via-orange-500 to-red-500',
        icon: 'from-yellow-500 to-orange-600',
        accent: 'from-yellow-300 to-orange-400',
        badge: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        text: 'text-orange-600'
      };
    }
    return {
      card: 'from-blue-400 via-purple-500 to-indigo-600',
      icon: 'from-blue-500 to-purple-600',
      accent: 'from-blue-300 to-purple-400',
      badge: 'bg-gradient-to-r from-blue-500 to-purple-500',
      text: 'text-blue-600'
    };
  };

  const colors = getGradientColors();

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border-0 transition-all duration-500 cursor-pointer transform hover:scale-105',
        isSelected
          ? 'shadow-2xl shadow-blue-500/25'
          : 'shadow-lg hover:shadow-xl',
        className
      )}
      onClick={onSelect}
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        isSelected ? colors.card : 'from-gray-50 to-gray-100'
      )} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      
      {/* Content */}
      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-4 sm:p-5 rounded-2xl transition-all duration-500 shadow-xl',
              isSelected 
                ? `bg-gradient-to-br ${colors.icon} shadow-blue-500/40` 
                : 'bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-blue-500 group-hover:to-purple-600 group-hover:shadow-blue-500/40'
            )}>
              {getIcon()}
            </div>
            <div>
              <h3 className={cn(
                'text-lg sm:text-xl font-bold mb-1',
                isSelected ? 'text-white' : 'text-gray-800'
              )}>
                {model.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm font-medium px-2 py-1 rounded-full',
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                )}>
                  {model.format.toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-white/80' : 'text-gray-500'
                  )}>
                    4.8
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          {isSelected && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="hidden sm:inline">Ativo</span>
              </div>
              <div className={cn(
                'px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg',
                colors.badge
              )}>
                VISUALIZANDO
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {model.description && (
          <p className={cn(
            'text-sm mb-6 line-clamp-2 leading-relaxed',
            isSelected ? 'text-white/90' : 'text-gray-600'
          )}>
            {model.description}
          </p>
        )}

        {/* File Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className={cn(
              'h-4 w-4',
              isSelected ? 'text-white/70' : 'text-gray-400'
            )} />
            <span className={cn(
              'text-sm font-medium',
              isSelected ? 'text-white/80' : 'text-gray-500'
            )}>
              Arquivo: {model.name}
            </span>
          </div>
          {model.size && (
            <span className={cn(
              'text-sm font-bold px-2 py-1 rounded-lg',
              isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            )}>
              {(model.size / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={cn(
              'flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg transform hover:scale-105',
              isSelected
                ? 'bg-white text-blue-600 hover:bg-white/90 shadow-white/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/30'
            )}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{isSelected ? 'Visualizando' : 'Visualizar'}</span>
            <span className="sm:hidden">{isSelected ? 'Ativo' : 'Ver'}</span>
          </button>
          
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className={cn(
                'flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg transform hover:scale-105',
                isSelected
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              )}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Baixar</span>
              <span className="sm:hidden">↓</span>
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-pulse" />
      )}
    </div>
  );
};
