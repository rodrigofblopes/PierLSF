import React from 'react';
import { ExternalLink, Download } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'concluido' | 'em-andamento' | 'planejado';
  location: string;
  type: 'arquitetura' | 'eletrico';
  progress: number;
  files: Array<{ name: string; path: string }>;
  professional: {
    name: string;
    role: string;
    instagram: string;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  location,
  type,
  progress,
  files,
  professional
}) => {
  // Função para abrir link do Instagram
  const handleInstagramClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Função para fazer download dos arquivos
  const handleFileDownload = (filePath: string, fileName: string) => {
    // Cria um link temporário para download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {/* Status e Progresso */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Arquivos */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Arquivos:</h4>
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => handleFileDownload(file.path, file.name)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-1 text-sm hover:underline"
          >
            <Download size={16} />
            {file.name}
          </button>
        ))}
      </div>

      {/* Profissional Responsável */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Profissional Responsável:</h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{professional.name}</p>
            <p className="text-sm text-gray-600">{professional.role}</p>
          </div>
          <button
            onClick={() => handleInstagramClick(professional.instagram)}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm hover:underline"
          >
            <ExternalLink size={16} />
            Instagram
          </button>
        </div>
      </div>
    </div>
  );
};