import React from 'react';
import { 
  RotateCcw, 
  ZoomIn, 
  Move, 
  Grid3X3, 
  Box, 
  Sun, 
  Moon,
  Play,
  Pause,
  RotateCw
} from 'lucide-react';
import { ViewerState } from '@/types';
import { cn } from '@/utils/cn';

interface ControlPanelProps {
  state: ViewerState;
  onControlsChange: (updates: Partial<ViewerState['controls']>) => void;
  onLightingChange: (updates: Partial<ViewerState['lighting']>) => void;
  onAnimationChange: (updates: Partial<ViewerState['animation']>) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onControlsChange,
  onLightingChange,
  onAnimationChange,
  onReset,
}) => {
  const controls = state.controls;
  const lighting = state.lighting;
  const animation = state.animation;

  return (
    <div className="glass-dark p-4 rounded-xl space-y-6 border border-primary-500/10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">Controles 3D</h3>
        <button
          onClick={onReset}
          className="btn-secondary text-sm hover:shadow-primary-500/20"
          title="Resetar visualizador"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Camera Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Câmera</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onControlsChange({ enableZoom: !controls.enableZoom })}
            className={cn(
              'btn-secondary text-xs flex items-center gap-2',
              controls.enableZoom && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            <ZoomIn className="h-3 w-3" />
            Zoom
          </button>
          <button
            onClick={() => onControlsChange({ enablePan: !controls.enablePan })}
            className={cn(
              'btn-secondary text-xs flex items-center gap-2',
              controls.enablePan && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            <Move className="h-3 w-3" />
            Pan
          </button>
          <button
            onClick={() => onControlsChange({ enableRotate: !controls.enableRotate })}
            className={cn(
              'btn-secondary text-xs flex items-center gap-2',
              controls.enableRotate && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            <RotateCw className="h-3 w-3" />
            Rotate
          </button>
          <button
            onClick={() => onControlsChange({ autoRotate: !controls.autoRotate })}
            className={cn(
              'btn-secondary text-xs flex items-center gap-2',
              controls.autoRotate && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            <Play className="h-3 w-3" />
            Auto
          </button>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Exibição</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={controls.showGrid}
              onChange={(e) => onControlsChange({ showGrid: e.target.checked })}
              className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
            />
            <Grid3X3 className="h-4 w-4" />
            Grade
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={controls.showAxes}
              onChange={(e) => onControlsChange({ showAxes: e.target.checked })}
              className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
            />
            <Box className="h-4 w-4" />
            Eixos
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={controls.wireframe}
              onChange={(e) => onControlsChange({ wireframe: e.target.checked })}
              className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
            />
            Wireframe
          </label>
        </div>
      </div>

      {/* Lighting Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Iluminação</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Ambiente: {Math.round(lighting.ambientIntensity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={lighting.ambientIntensity}
              onChange={(e) => onLightingChange({ ambientIntensity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Direcional: {Math.round(lighting.directionalIntensity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={lighting.directionalIntensity}
              onChange={(e) => onLightingChange({ directionalIntensity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lighting.enableShadows}
              onChange={(e) => onLightingChange({ enableShadows: e.target.checked })}
              className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
            />
            <Sun className="h-4 w-4" />
            Sombras
          </label>
        </div>
      </div>

      {/* Model Info */}
      {state.model && (
        <div className="space-y-2 pt-4 border-t border-dark-700">
          <h4 className="text-sm font-medium text-gray-300">Modelo</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Nome: {state.model.name}</div>
            <div>Formato: {state.model.format.toUpperCase()}</div>
            {state.model.size && (
              <div>Tamanho: {(state.model.size / 1024 / 1024).toFixed(2)} MB</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
