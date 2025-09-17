import React from 'react';
import { Camera, Eye, Maximize2, RotateCcw, ZoomIn, ZoomOut, Save, Trash2 } from 'lucide-react';

interface CameraControlsProps {
  onCameraPreset: (preset: 'front' | 'side' | 'top' | 'iso' | 'reset') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSavePosition: () => void;
  onClearPosition: () => void;
  className?: string;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCameraPreset,
  onZoomIn,
  onZoomOut,
  onReset,
  onSavePosition,
  onClearPosition,
  className = ''
}) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2 ${className}`}>
      <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-2">
        <Camera className="w-4 h-4" />
        Câmera
      </div>
      
      {/* Presets de Câmera */}
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => onCameraPreset('front')}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
          title="Vista Frontal"
        >
          <Eye className="w-3 h-3" />
          Frontal
        </button>
        
        <button
          onClick={() => onCameraPreset('side')}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
          title="Vista Lateral"
        >
          <Eye className="w-3 h-3" />
          Lateral
        </button>
        
        <button
          onClick={() => onCameraPreset('top')}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
          title="Vista Superior"
        >
          <Maximize2 className="w-3 h-3" />
          Superior
        </button>
        
        <button
          onClick={() => onCameraPreset('iso')}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
          title="Vista Isométrica"
        >
          <Maximize2 className="w-3 h-3" />
          Isométrica
        </button>
      </div>
      
      {/* Controles de Zoom */}
      <div className="flex gap-1">
        <button
          onClick={onZoomIn}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3 h-3" />
          +
        </button>
        
        <button
          onClick={onZoomOut}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3 h-3" />
          -
        </button>
      </div>
      
      {/* Salvar Posição */}
      <button
        onClick={onSavePosition}
        className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
        title="Salvar Posição Atual da Câmera"
      >
        <Save className="w-3 h-3" />
        Salvar Posição
      </button>
      
      {/* Limpar Posição Salva */}
      <button
        onClick={onClearPosition}
        className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
        title="Limpar Posição Salva da Câmera"
      >
        <Trash2 className="w-3 h-3" />
        Limpar Posição
      </button>
      
      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
        title="Resetar Câmera"
      >
        <RotateCcw className="w-3 h-3" />
        Reset
      </button>
    </div>
  );
};
