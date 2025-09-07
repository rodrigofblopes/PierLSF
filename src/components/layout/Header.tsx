import React from 'react';
import { Building2, Download, Share2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onDownload,
  onShare,
  className,
}) => {
  return (
    <header className={cn('glass-primary p-4 rounded-xl border border-primary-500/20', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Clínica UNIQUE - Medicina Especializada</h1>
            <p className="text-sm text-primary-200">Visualizador de Arquitetura Interativo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onDownload}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Baixar modelo"
          >
            <Download className="h-4 w-4" />
            Baixar
          </button>
          
          <button
            onClick={onShare}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Compartilhar"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
        </div>
      </div>
    </header>
  );
};
