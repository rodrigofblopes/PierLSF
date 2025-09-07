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
          <div className="logo-container h-12 w-12 rounded-lg shadow-lg border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
            <img 
              src="/BIMTECH.jpg" 
              alt="BIMTECH Logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                console.error('Erro ao carregar logo BIMTECH');
                e.currentTarget.style.display = 'none';
                // Mostrar fallback
                const fallback = document.createElement('span');
                fallback.textContent = 'BIM';
                fallback.className = 'text-white font-bold text-xs';
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
              onLoad={() => {
                console.log('Logo BIMTECH carregada com sucesso');
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Clínica UNIQUE - Medicina Especializada</h1>
            <p className="text-sm text-primary-200">Visualizador de Arquitetura Interativo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href="/BIMTECH.jpg" 
            target="_blank" 
            className="btn-secondary text-sm flex items-center gap-2"
            title="Ver Logo"
          >
            <Download className="h-4 w-4" />
            Ver Logo
          </a>
          
          <a 
            href="/Arquitetura.pdf" 
            target="_blank" 
            className="btn-secondary text-sm flex items-center gap-2"
            title="Baixar PDF"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </a>
          
          <a 
            href="https://www.instagram.com/arq_marianacasagrande/" 
            target="_blank" 
            className="btn-secondary text-sm flex items-center gap-2"
            title="Instagram"
          >
            <Share2 className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
};
