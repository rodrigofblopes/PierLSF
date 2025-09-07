import React from 'react';
import { Building2, RotateCw, Download, Eye } from 'lucide-react';
import { ModelInfo } from '@/types';
import { cn } from '@/utils/cn';

interface ModelCardProps {
  model: ModelInfo;
  isSelected: boolean;
  onSelect: () => void;
  onDownload?: () => void;
  className?: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected,
  onSelect,
  onDownload,
  className,
}) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer h-48',
        isSelected
          ? 'border-primary-500 bg-gradient-to-br from-primary-500/20 to-primary-600/10 shadow-lg shadow-primary-500/30'
          : 'border-dark-600 bg-gradient-to-br from-dark-800/80 to-dark-900/80 hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-500/10 hover:to-primary-600/5',
        className
      )}
      onClick={onSelect}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
      
      {/* Content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-4 rounded-xl transition-all duration-300 shadow-lg',
              isSelected 
                ? 'bg-gradient-to-br from-primary-600 to-primary-700 shadow-primary-500/30' 
                : 'bg-gradient-to-br from-dark-700 to-dark-800 group-hover:from-primary-600 group-hover:to-primary-700 group-hover:shadow-primary-500/30'
            )}>
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{model.name}</h3>
              <p className="text-base text-gray-300">{model.format.toUpperCase()}</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          {isSelected && (
            <div className="flex items-center gap-1 text-primary-400 text-sm">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span>Ativo</span>
            </div>
          )}
        </div>

        {/* Description */}
        {model.description && (
          <p className="text-base text-gray-200 mb-6 line-clamp-2">
            {model.description}
          </p>
        )}

        {/* File Info */}
        <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
          <span>Arquivo: {model.name}</span>
          {model.size && (
            <span>{(model.size / 1024 / 1024).toFixed(2)} MB</span>
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
              'flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg',
              isSelected
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-primary-500/30'
                : 'bg-gradient-to-r from-dark-700 to-dark-800 hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white shadow-lg hover:shadow-primary-500/30'
            )}
          >
            <Eye className="h-5 w-5" />
            {isSelected ? 'Visualizando' : 'Visualizar'}
          </button>
          
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-dark-700 to-dark-800 hover:from-dark-600 hover:to-dark-700 text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-lg"
            >
              <Download className="h-5 w-5" />
              Baixar
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
