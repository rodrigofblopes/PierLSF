import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, CheckCircle, AlertCircle, Eye, EyeOff, Package } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { findServiceMapping, ServiceMapping } from '@/utils/serviceMapping';

interface CSVItem {
  item: string;
  unid: string;
  qtd: string;
  elementos3d: string; // Mantido para consulta interna, mas não exibido
  textura: string; // Nova coluna para texturas
}

interface CSVTableProps {
  className?: string;
  onServiceSelect?: (serviceMapping: ServiceMapping | null, textureType?: string) => void;
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

  // DEBUG: Log do CSVTable
  console.log('🐛 DEBUG CSVTable component rendered');
  console.log('🐛 DEBUG className:', className);
  console.log('🐛 DEBUG onServiceSelect:', onServiceSelect);
  console.log('🐛 DEBUG selectedService:', selectedService);
  console.log('🐛 DEBUG hiddenServices:', hiddenServices);

  const loadCSVData = async () => {
    console.log('🐛 DEBUG loadCSVData started');
    setLoading(true);
    setError(null);
    
    try {
      console.log('🐛 DEBUG Fetching CSV from: ./Link.csv');
      const response = await fetch('./Link.csv');
      console.log('🐛 DEBUG CSV response:', response);
      console.log('🐛 DEBUG CSV response.ok:', response.ok);
      console.log('🐛 DEBUG CSV response.status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Arquivo CSV não encontrado - Status: ${response.status}`);
      }
      
      const csvText = await response.text();
      console.log('🐛 DEBUG CSV text length:', csvText.length);
      console.log('🐛 DEBUG CSV first 100 chars:', csvText.substring(0, 100));
      const lines = csvText.split('\n').filter(line => line.trim());
      
      // Converter CSV para array de objetos
      const csvData: CSVItem[] = lines
        .slice(1) // Pular cabeçalho
        .filter(line => line.trim()) // Filtrar linhas vazias
        .map(line => {
          const [item, unid, qtd, elementos3d, textura] = line.split(';');
          return {
            item: item?.trim() || '',
            unid: unid?.trim() || '',
            qtd: qtd?.trim() || '',
            elementos3d: elementos3d?.trim() || '',
            textura: textura?.trim() || ''
          };
        });
      
      setData(csvData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados CSV');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, []);


  const handleServiceClick = (serviceName: string) => {
    console.log('🖱️ Clique na linha:', serviceName);
    const mapping = findServiceMapping(serviceName);
    const item = data.find(d => d.item === serviceName);
    const textureType = item?.textura || '';
    console.log('🔗 Mapeamento encontrado:', mapping);
    console.log('🎨 Tipo de textura:', textureType);
    if (onServiceSelect) {
      onServiceSelect(mapping || null, textureType);
    }
  };

  const handleToggleVisibility = (serviceName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Evitar que o clique na linha seja acionado
    console.log('👁️ Toggle visibilidade:', serviceName);
    const mapping = findServiceMapping(serviceName);
    if (onToggleVisibility) {
      onToggleVisibility(mapping || null);
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
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Cabeçalho */}
      <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tabela de Serviços</h3>
              <p className="text-sm text-gray-600 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sistema de gestão de serviços</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[450px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-[60%]">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Serviço</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-[20%]">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <span>Unidade</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[20%]">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Quantidade</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item, index) => {
              const isSelected = selectedService === item.item;
              const mapping = findServiceMapping(item.item);
              const hasMapping = !!mapping;
              const isHidden = hiddenServices.includes(item.item);
              
              return (
                <tr 
                  key={index} 
                  className={`
                    transition-all duration-200 group cursor-pointer
                    ${isSelected 
                      ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-500' 
                      : isHidden
                        ? 'bg-gradient-to-r from-gray-100 to-gray-50 opacity-60'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                    }
                  `}
                  onClick={() => handleServiceClick(item.item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-2 h-2 rounded-full transition-colors
                        ${isSelected 
                          ? 'bg-orange-500' 
                          : hasMapping 
                            ? 'bg-blue-500 group-hover:bg-blue-600' 
                            : 'bg-gray-400'
                        }
                      `}></div>
                      <div className={`
                        text-sm font-medium transition-colors
                        ${isSelected 
                          ? 'text-orange-900' 
                          : 'text-gray-900 group-hover:text-blue-900'
                        }
                      `}>
                        {item.item}
                      </div>
                      {hasMapping && (
                        <button
                          onClick={(e) => handleToggleVisibility(item.item, e)}
                          className={`p-1 rounded transition-colors ${
                            isHidden 
                              ? 'text-gray-400 hover:text-gray-600' 
                              : isSelected 
                                ? 'text-orange-600 hover:text-orange-700' 
                                : 'text-blue-500 hover:text-blue-600'
                          }`}
                          title={isHidden ? 'Mostrar elementos' : 'Ocultar elementos'}
                        >
                          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors
                        ${isSelected 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800 group-hover:bg-green-200'
                        }
                      `}>
                        {item.unid}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {item.qtd ? (
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors
                          ${isSelected 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-purple-100 text-purple-800 group-hover:bg-purple-200'
                          }
                        `}>
                          {item.qtd}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-colors">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pendente
                        </span>
                      )}
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
