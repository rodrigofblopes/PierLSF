import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [logoPath, setLogoPath] = useState('/previa-unique.png');

  const handleLogoError = () => {
    console.error('❌ Erro ao carregar logo Prévia Unique');
    console.error('Caminho tentado:', logoPath);
    
    if (logoPath === '/previa-unique.png') {
      // Tentar caminho alternativo
      setLogoPath('/Prévia%20Unique.png');
    } else if (logoPath === '/Prévia%20Unique.png') {
      // Tentar terceiro caminho
      setLogoPath('/Prévia Unique.png');
    } else {
      // Se ainda falhar, mostrar fallback
      setLogoError(true);
    }
  };

  const handleLogoLoad = () => {
    console.log('✅ Logo Prévia Unique carregada com sucesso');
    setLogoError(false);
  };

  return (
    <header className={cn('glass-primary p-4 rounded-xl border border-primary-500/20', className)}>
      <div className="flex items-center justify-center">
        <div className="logo-container h-24 w-auto max-w-sm rounded-lg shadow-lg border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
          {logoError ? (
            <span className="text-white font-bold text-xl">Prévia Unique</span>
          ) : (
            <img 
              src={logoPath} 
              alt="Prévia Unique Logo" 
              className="h-full w-full object-contain p-2"
              onError={handleLogoError}
              onLoad={handleLogoLoad}
              style={{ maxHeight: '80px', maxWidth: '200px' }}
            />
          )}
        </div>
      </div>
    </header>
  );
};
