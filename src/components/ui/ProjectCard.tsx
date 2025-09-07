import React from 'react';
import { MapPin, Users, FileText, Building, Zap, Download, Instagram, Droplets, Wrench } from 'lucide-react';
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
        return <Wrench className="h-5 w-5" />;
      case 'hidraulico':
        return <Droplets className="h-5 w-5" />;
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

  // Função para lidar com clique no link do Instagram
  const handleInstagramClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation(); // Impede que o evento suba para elementos pai
    e.preventDefault(); // Impede comportamento padrão
    
    console.log('=== CLIQUE NO INSTAGRAM ===');
    console.log('URL:', url);
    console.log('Evento:', e);
    
    try {
      // Método mais simples e direto
      console.log('Abrindo Instagram em nova aba...');
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log('Instagram aberto com sucesso!');
    } catch (error) {
      console.error('Erro ao abrir Instagram:', error);
      // Fallback: redirecionar na mesma aba
      console.log('Fallback: redirecionando na mesma aba');
      window.location.href = url;
    }
  };

  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-2xl border-0 transition-all duration-500 shadow-lg hover:shadow-xl',
        className
      )}
      // Removido qualquer onClick no container principal
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        getTypeColor()
      )} />
      
      {/* Decorative Elements - CORRIGIDO: pointer-events-none para não bloquear cliques */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
      
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

        {/* Professional Info - CORRIGIDO */}
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
                    <div
                      onClick={(e) => {
                        console.log('Div clicada!');
                        console.log('Evento:', e);
                        console.log('URL do Instagram:', professional.instagram);
                        handleInstagramClick(e, professional.instagram!);
                      }}
                      className="flex items-center gap-2 text-white font-medium hover:text-white/80 transition-colors group cursor-pointer select-none"
                      title={`Acessar Instagram de ${professional.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        console.log('Tecla pressionada:', e.key);
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleInstagramClick(e as any, professional.instagram!);
                        }
                      }}
                    >
                      <span>{professional.name}</span>
                      <Instagram className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                      <span className="text-xs text-white/40">@{professional.instagram?.split('/').pop()?.replace('/', '')}</span>
                    </div>
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
                onClick={async (e) => {
                  console.log(`=== BOTÃO ${file.name} CLICADO ===`);
                  console.log(`Caminho: ${file.path}`);
                  console.log(`Nome: ${file.name}`);
                  
                  // Parar propagação de eventos
                  e.stopPropagation();
                  e.preventDefault();
                  
                  // Feedback visual
                  const button = e.currentTarget;
                  const originalText = button.innerHTML;
                  button.innerHTML = '<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div><span class="ml-2">Baixando...</span>';
                  button.disabled = true;
                  
                  try {
                    console.log(`Chamando downloadFile...`);
                    const result = await downloadFile(file.path, file.name);
                    console.log(`Resultado do download:`, result);
                    if (result) {
                      console.log(`✅ Download de ${file.name} iniciado com sucesso!`);
                    } else {
                      console.log(`⚠️ Download de ${file.name} falhou, arquivo aberto em nova aba`);
                    }
                  } catch (error) {
                    console.error(`❌ Erro no download:`, error);
                    alert(`Erro ao baixar ${file.name}. Tente novamente.`);
                  } finally {
                    // Restaurar botão
                    button.innerHTML = originalText;
                    button.disabled = false;
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span className="flex-1 text-left">{file.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Effect - CORRIGIDO: pointer-events-none para não bloquear cliques */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};