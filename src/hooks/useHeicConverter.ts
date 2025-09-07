import { useState, useEffect } from 'react';

interface UseHeicConverterResult {
  convertedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useHeicConverter = (imagePath: string): UseHeicConverterResult => {
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const convertHeicToJpg = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Verificar se o arquivo é HEIC
        if (!imagePath.toLowerCase().endsWith('.heic')) {
          // Se não for HEIC, usar a imagem diretamente
          setConvertedImage(imagePath);
          setIsLoading(false);
          return;
        }

        // Carregar o arquivo HEIC
        const response = await fetch(imagePath);
        if (!response.ok) {
          throw new Error(`Erro ao carregar imagem: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'image/heic' });

        // Verificar se heic2any está disponível no window
        const heic2any = (window as any).heic2any;
        if (!heic2any) {
          console.warn('heic2any não está disponível, usando imagem original');
          setConvertedImage(imagePath);
          setIsLoading(false);
          return;
        }

        console.log('Iniciando conversão HEIC para JPG...', { blob, blobType: blob.type, blobSize: blob.size });

        // Converter HEIC para JPG
        const convertedBlob = await heic2any(blob, {
          toType: 'image/jpeg',
          quality: 0.8
        });

        console.log('Conversão concluída:', { convertedBlob });

        // Criar URL para a imagem convertida
        const convertedUrl = URL.createObjectURL(convertedBlob as Blob);
        setConvertedImage(convertedUrl);
      } catch (err) {
        console.error('Erro ao converter HEIC:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        // Fallback: tentar usar a imagem original
        setConvertedImage(imagePath);
      } finally {
        setIsLoading(false);
      }
    };

    convertHeicToJpg();

    // Cleanup: revogar URL quando o componente for desmontado
    return () => {
      if (convertedImage && convertedImage.startsWith('blob:')) {
        URL.revokeObjectURL(convertedImage);
      }
    };
  }, [imagePath]);

  return { convertedImage, isLoading, error };
};
