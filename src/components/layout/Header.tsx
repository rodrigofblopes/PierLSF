import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { useIsMobile, useIsExtraSmall } from '@/hooks/useMediaQuery';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [logoPath, setLogoPath] = useState('/previa-unique.png');
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();

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
    <header className={cn('glass-primary p-2 sm:p-4 rounded-xl border border-primary-500/20', className)}>
      <div className="flex items-center justify-center">
        <div className="logo-container h-16 sm:h-20 lg:h-24 w-auto max-w-xs sm:max-w-sm rounded-lg shadow-lg border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
          {logoError ? (
            <span className="text-white font-bold text-base sm:text-lg lg:text-xl px-2">Prévia Unique</span>
          ) : (
            <img 
              src={logoPath} 
              alt="Prévia Unique Logo" 
              className="h-full w-full object-contain p-1 sm:p-2"
              onError={handleLogoError}
              onLoad={handleLogoLoad}
              style={{ 
                maxHeight: isExtraSmall ? '50px' : isMobile ? '60px' : '80px', 
                maxWidth: isExtraSmall ? '120px' : isMobile ? '150px' : '200px' 
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};
