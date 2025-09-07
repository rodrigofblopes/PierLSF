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
          <div className="h-12 w-12 rounded-lg shadow-lg border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
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
          <button
            onClick={() => {
              console.log('Teste logo BIMTECH');
              const img = new Image();
              img.onload = () => console.log('Logo carregada via JS');
              img.onerror = () => console.log('Erro ao carregar logo via JS');
              img.src = '/BIMTECH.jpg';
            }}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Teste Logo"
          >
            <Download className="h-4 w-4" />
            Teste Logo
          </button>
          
          <button
            onClick={() => {
              console.log('Teste de download clicado');
              const link = document.createElement('a');
              link.href = '/Arquitetura.pdf';
              link.download = 'Arquitetura.pdf';
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Teste Download"
          >
            <Download className="h-4 w-4" />
            Teste PDF
          </button>
          
          <button
            onClick={() => {
              console.log('Teste Instagram clicado');
              window.open('https://www.instagram.com/arq_marianacasagrande/', '_blank');
            }}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Teste Instagram"
          >
            <Share2 className="h-4 w-4" />
            Teste IG
          </button>
        </div>
      </div>
    </header>
  );
};
