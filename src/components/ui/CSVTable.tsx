import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Eye, EyeOff, Package } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { findServiceMapping, ServiceMapping } from '@/utils/serviceMapping';

interface CSVItem {
  disciplina: string;
  elementos3d: string;
}

interface CSVTableProps {
  className?: string;
  onServiceSelect?: (serviceMapping: ServiceMapping | null, textureType?: string, elements3d?: string[]) => void;
  selectedService?: string | null;
  onToggleVisibility?: (serviceMapping: ServiceMapping | null) => void;
  hiddenServices?: string[];
}

export const CSVTable: React.FC<CSVTableProps> = ({ 
  className = '', 
  onServiceSelect, 
  selectedService,
  onToggleVisibility,
  hiddenServices = []
}) => {
  const [data, setData] = useState<CSVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCSVData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('./Etapas.csv');
      if (!response.ok) {
        throw new Error('Arquivo CSV não encontrado');
      }
      
      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      
          // Converter CSV para array de objetos - Nova estrutura com elementos 3D
          const csvData: CSVItem[] = lines
            .slice(1) // Pular cabeçalho
            .filter(line => line.trim()) // Filtrar linhas vazias
            .map(line => {
              const parts = line.split(';').map(part => part.trim());
              const disciplina = parts[0] || '';
              const elementos3d = parts.slice(1).join(';'); // Pegar todos os elementos a partir do segundo
              
              
              return {
                disciplina,
                elementos3d
              };
            });
      
      console.log('📊 Dados CSV carregados:', csvData);
      console.log('📊 Total de itens:', csvData.length);
      console.log('📊 Primeiros 3 itens:', csvData.slice(0, 3));
      setData(csvData);
    } catch (err) {
      console.error('❌ Erro ao carregar CSV:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados CSV');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, []);


      const handleServiceClick = (disciplina: string) => {
        console.log('🖱️ Clique na linha:', disciplina);
        const mapping = findServiceMapping(disciplina);
        console.log('🔗 Mapeamento encontrado:', mapping);
        
        
        
        
        
        

        if (onServiceSelect) {
          // Verificar se já está selecionado para desselecionar
          if (selectedService === disciplina) {
            console.log('🔄 Desselecionando disciplina:', disciplina);
            onServiceSelect(null, undefined, []);
            return;
          }
          
          // Selecionar a disciplina
          console.log('✅ Selecionando disciplina:', disciplina);
            
          // Encontrar os elementos 3D da disciplina selecionada
          const item = data.find(d => d.disciplina === disciplina);
          console.log('🔍 Item encontrado no CSV:', item);
          
          // Função para dividir corretamente os elementos 3D
          const parseElements3D = (elementsString: string): string[] => {
            if (!elementsString) return [];
            
            // Caso especial para "Estrutura (7337 elementos)" - usar apenas "Estrutura"
            if (elementsString.includes('(7337 elementos)')) {
              return ['Estrutura'];
            }
            
            // Dividir por vírgula (,) e limpar espaços
            const elements = elementsString.split(',').map(el => el.trim()).filter(el => el.length > 0);
            
            return elements;
          };
          
          const elements3d = item?.elementos3d 
            ? parseElements3D(item.elementos3d)
            : [];
          
          console.log('🎯 Elementos 3D encontrados:', elements3d);
          console.log('📊 Total de elementos 3D:', elements3d.length);
          console.log('🔍 Primeiros 5 elementos:', elements3d.slice(0, 5));
          console.log('🔍 Últimos 5 elementos:', elements3d.slice(-5));
          console.log('🔍 Chamando onServiceSelect com elementos3d:', elements3d);
          onServiceSelect(mapping || null, mapping?.textureType, elements3d);
        }
      };

  const handleToggleVisibility = (serviceName: string, event: React.MouseEvent) => {
    console.log('🛑 Evento de toggle capturado, chamando stopPropagation');
    event.stopPropagation(); // Evitar que o clique na linha seja acionado
    event.preventDefault(); // Prevenir comportamento padrão
    console.log('👁️ Toggle visibilidade clicado:', serviceName);
    const mapping = findServiceMapping(serviceName);
    console.log('🔍 Mapping encontrado:', mapping);
    if (onToggleVisibility) {
      console.log('📞 Chamando onToggleVisibility com mapping:', mapping);
      onToggleVisibility(mapping || null);
    } else {
      console.log('❌ onToggleVisibility não está definido');
    }
  };


  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="md" />
            <span className="ml-3 text-gray-600">Carregando dados...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FileText size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadCSVData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border flex flex-col h-full ${className}`}>

      {/* Tabela - Enhanced Mobile */}
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 h-full">
        <table className="w-full min-w-[250px] sm:min-w-[300px] md:min-w-[350px]">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2 sm:space-x-2">
                      <FileText className="w-4 h-4 sm:w-4 sm:h-4 text-blue-600" />
                      <span className="text-xs sm:text-sm">Etapas</span>
                    </div>
                  </th>
                </tr>
              </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item, index) => {
              const isSelected = selectedService === item.disciplina;
              const mapping = findServiceMapping(item.disciplina);
              const hasMapping = !!mapping;
              const isHidden = hiddenServices.includes(item.disciplina);
              
              // Debug log para verificar se o mapping está sendo encontrado
              console.log(`🔍 Item: ${item.disciplina}, mapping:`, mapping, `hasMapping: ${hasMapping}`);
              
              return (
                <tr 
                  key={index} 
                  className={`
                    transition-all duration-300 group cursor-pointer touch-manipulation
                    ${isSelected 
                      ? 'bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-500 shadow-md ring-1 ring-orange-200' 
                      : isHidden
                        ? 'bg-gradient-to-r from-gray-100 to-gray-50 opacity-60'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 active:bg-blue-100'
                    }
                  `}
                  onClick={() => handleServiceClick(item.disciplina)}
                >
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-1 min-w-0">
                            <div className={`
                              w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-colors flex-shrink-0
                              ${isSelected
                                ? 'bg-orange-600 shadow-sm'
                                : hasMapping
                                  ? 'bg-blue-500 group-hover:bg-blue-600'
                                  : 'bg-gray-400'
                              }
                            `}></div>
                            <div className={`
                              text-xs sm:text-sm font-semibold transition-colors truncate min-w-0
                              ${isSelected
                                ? 'text-orange-800'
                                : 'text-gray-900 group-hover:text-blue-900'
                              }
                            `}>
                              {item.disciplina}
                              {isSelected && (
                                <span className="ml-1 text-xs text-orange-600 font-normal">
                                  (clique para desselecionar)
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Ícone de visibilidade - Enhanced Mobile */}
                          <div className="flex-shrink-0 ml-2">
                            {hasMapping ? (
                              <button
                                onClick={(e) => {
                                  console.log('🖱️ Botão de visibilidade clicado para:', item.disciplina);
                                  handleToggleVisibility(item.disciplina, e);
                                }}
                                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation relative z-10 active:scale-95 ${
                                  isHidden
                                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    : isSelected
                                      ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                }`}
                                title={isHidden ? 'Mostrar elementos' : 'Ocultar elementos'}
                              >
                                {isHidden ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </button>
                            ) : (
                              <div className="flex items-center justify-center p-2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
