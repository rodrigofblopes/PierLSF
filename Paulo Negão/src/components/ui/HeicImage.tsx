import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useHeicConverter } from '@/hooks/useHeicConverter';

interface HeicImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const HeicImage: React.FC<HeicImageProps> = ({
  src,
  alt,
  className = "w-full h-48 object-cover",
  fallbackClassName = "w-full h-48 bg-gray-200 flex items-center justify-center"
}) => {
  const { convertedImage, isLoading, error } = useHeicConverter(src);

  if (isLoading) {
    return (
      <div className={fallbackClassName}>
        <div className="text-center text-gray-500">
          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p className="text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !convertedImage) {
    return (
      <div className={fallbackClassName}>
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{alt}</p>
          <p className="text-xs">Formato HEIC</p>
          {error && <p className="text-xs text-red-500 mt-1">Erro: {error}</p>}
        </div>
      </div>
    );
  }

  return (
    <img
      src={convertedImage}
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback adicional em caso de erro na imagem
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
        if (fallback) {
          fallback.style.display = 'flex';
        }
      }}
    />
  );
};
