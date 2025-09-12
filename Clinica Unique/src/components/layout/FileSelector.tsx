import React, { useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { ModelInfo } from '@/types';
import { cn } from '@/utils/cn';

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
  onModelSelect: (model: ModelInfo) => void;
  availableModels: ModelInfo[];
  selectedModel?: ModelInfo | null;
  className?: string;
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  onFileSelect,
  onModelSelect,
  availableModels,
  selectedModel,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-dark-600 rounded-xl p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300 mb-1">
          Arraste um arquivo GLB/GLTF aqui ou clique para selecionar
        </p>
        <p className="text-xs text-gray-500">
          Formatos suportados: .glb, .gltf
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Available Models */}
      {availableModels.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Modelos Disponíveis</h3>
          <div className="space-y-2">
            {availableModels.map((model) => (
              <button
                key={model.path}
                onClick={() => onModelSelect(model)}
                className={cn(
                  'w-full p-3 rounded-lg border text-left transition-colors',
                  selectedModel?.path === model.path
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-800/50 hover:border-dark-500'
                )}
              >
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4 text-primary-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {model.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {model.format.toUpperCase()}
                      {model.size && ` • ${(model.size / 1024 / 1024).toFixed(2)} MB`}
                    </div>
                  </div>
                  {selectedModel?.path === model.path && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Model Info */}
      {selectedModel && (
        <div className="glass-dark p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Modelo Selecionado</h4>
            <button
              onClick={() => onModelSelect(null as any)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Nome: {selectedModel.name}</div>
            <div>Formato: {selectedModel.format.toUpperCase()}</div>
            {selectedModel.size && (
              <div>Tamanho: {(selectedModel.size / 1024 / 1024).toFixed(2)} MB</div>
            )}
            {selectedModel.description && (
              <div>Descrição: {selectedModel.description}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
