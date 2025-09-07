import React from 'react';
import { MapPin, Users, FileText, Building, Zap, Download, Instagram } from 'lucide-react';
import { cn } from '@/utils/cn';
import { downloadFile } from '@/utils/downloadFile';

interface ProjectFile {
  name: string;
  path: string;
}

interface Professional {
  name: string;
  role: string;
  instagram?: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'ativo' | 'planejamento' | 'concluido' | 'pausado';
  startDate?: string;
  endDate?: string;
  location: string;
  type: 'arquitetura' | 'eletrico' | 'estrutural' | 'hidraulico';
  progress?: number;
  className?: string;
  files?: ProjectFile[];
  professional?: Professional;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  location,
  type,
  progress = 0,
  className,
  files = [],
  professional,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500';
      case 'planejamento':
        return 'bg-blue-500';
      case 'concluido':
        return 'bg-gray-500';
      case 'pausado':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'planejamento':
        return 'Planejamento';
      case 'concluido':
        return 'Concluído';
      case 'pausado':
        return 'Pausado';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'arquitetura':
        return <Building className="h-5 w-5" />;
      case 'eletrico':
        return <Zap className="h-5 w-5" />;
      case 'estrutural':
        return <FileText className="h-5 w-5" />;
      case 'hidraulico':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'arquitetura':
        return 'from-blue-500 to-blue-600';
      case 'eletrico':
        return 'from-yellow-500 to-orange-500';
      case 'estrutural':
        return 'from-gray-500 to-gray-600';
      case 'hidraulico':
        return 'from-cyan-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleFileDownload = async (file: ProjectFile) => {
    console.log('handleFileDownload chamado para:', file.name, file.path);
    try {
      await downloadFile(file.path, file.name);
    } catch (error) {
      console.error('Erro no download:', error);
      // Fallback: tentar abrir diretamente
      window.open(file.path, '_blank');
    }
  };

  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-2xl border-0 transition-all duration-500 shadow-lg hover:shadow-xl',
        className
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        getTypeColor()
      )} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      
      {/* Content */}
      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-4 rounded-2xl transition-all duration-500 shadow-xl bg-white/20 backdrop-blur-sm'
            )}>
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-white/20 text-white">
                  {type.toUpperCase()}
                </span>
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white',
                  getStatusColor()
                )}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                  {getStatusText()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/90 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Project Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-white/80">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'ativo' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Progresso</span>
              <span className="text-sm font-bold text-white">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Professional Info */}
        {professional && (
          <div className="mb-6">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h4 className="text-sm font-medium text-white mb-2">Profissional Responsável:</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  {professional.instagram ? (
                    <button
                      onClick={() => {
                        console.log('Instagram link clicado:', professional.instagram);
                        try {
                          if (professional.instagram) {
                            window.open(professional.instagram, '_blank', 'noopener,noreferrer');
                          }
                        } catch (error) {
                          console.error('Erro ao abrir Instagram:', error);
                          // Fallback: tentar abrir diretamente
                          window.location.href = professional.instagram;
                        }
                      }}
                      className="flex items-center gap-2 text-white font-medium hover:text-white/80 transition-colors group cursor-pointer"
                      title={`Acessar Instagram de ${professional.name}`}
                    >
                      <span>{professional.name}</span>
                      <Instagram className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                  ) : (
                    <p className="text-white font-medium">{professional.name}</p>
                  )}
                  <p className="text-white/70 text-sm">{professional.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files Download */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white mb-3">Arquivos para Download:</h4>
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => handleFileDownload(file)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
              >
                <Download className="h-4 w-4" />
                <span className="flex-1 text-left">{file.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
