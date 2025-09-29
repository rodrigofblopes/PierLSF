import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, RotateCw, Maximize2, Grid3X3, List, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageItem {
  src: string;
  title: string;
  description: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  className = '' 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    resetImageTransform();
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    resetImageTransform();
  };

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
    resetImageTransform();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetImageTransform();
  };

  const resetImageTransform = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.5, 5));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.5, 0.5));
  };

  const downloadImage = (src: string, title: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeModal();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'r':
        case 'R':
          rotateImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Header com controles */}
      <div className="flex items-center justify-between mb-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Plantas e Cortes</h2>
          <span className="text-white/60 text-sm">({images.length} imagens)</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid/List de Imagens */}
      <div className={cn(
        'flex-1 overflow-auto',
        viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' 
          : 'flex flex-col gap-3'
      )}>
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative group cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-all duration-300',
              viewMode === 'list' ? 'flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10' : ''
            )}
            onClick={() => openModal(index)}
          >
            {viewMode === 'grid' ? (
              <div className="relative flex items-center justify-center bg-gray-100 rounded-lg p-3">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-auto max-h-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                    <ZoomIn className="w-8 h-8 text-white" />
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                      Clique para ampliar
                    </span>
                  </div>
                </div>
                
                {/* Título */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 rounded-b-lg">
                  <h3 className="text-white font-semibold text-xs">
                    {image.title}
                  </h3>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                    {image.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm">
                    {image.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-5 h-5 text-white/60" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Visualização Aprimorado */}
      {isModalOpen && (
        <div className={cn(
          'fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4',
          isFullscreen ? 'p-0' : ''
        )}>
          <div className={cn(
            'relative w-full h-full flex items-center justify-center',
            isFullscreen ? 'max-w-none max-h-none' : 'max-w-7xl max-h-full'
          )}>
            {/* Barra de Controles Superior */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">
                  {selectedIndex + 1} de {images.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Controles de Zoom */}
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg p-1">
                  <button
                    onClick={zoomOut}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                    title="Diminuir zoom"
                  >
                    <span className="text-lg font-bold">-</span>
                  </button>
                  <span className="text-white text-sm px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                    title="Aumentar zoom"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>

                {/* Botão Rotacionar */}
                <button
                  onClick={rotateImage}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                  title="Rotacionar (R)"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Botão Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                  title="Tela cheia (F)"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>

                {/* Botão Fechar */}
                <button
                  onClick={closeModal}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                  title="Fechar (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Botões de Navegação */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              title="Anterior (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              title="Próximo (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Imagem Principal com Transformações */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="max-w-full max-h-full flex items-center justify-center">
                <img
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].title}
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    cursor: zoomLevel > 1 ? 'grab' : 'default'
                  }}
                  draggable={false}
                />
              </div>
            </div>
            
            {/* Informações da Imagem */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {images[selectedIndex].title}
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  {images[selectedIndex].description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                    <span>Rotação: {rotation}°</span>
                  </div>
                  <button
                    onClick={() => downloadImage(images[selectedIndex].src, images[selectedIndex].title)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </button>
                </div>
              </div>
            </div>

            {/* Atalhos de Teclado */}
            <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white/60 text-xs">
              <div className="space-y-1">
                <div>← → Navegar</div>
                <div>+ - Zoom</div>
                <div>R Rotacionar</div>
                <div>F Tela cheia</div>
                <div>ESC Fechar</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};