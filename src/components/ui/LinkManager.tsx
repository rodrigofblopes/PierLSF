import React, { useState, useEffect, useMemo } from 'react';
import { Link, Unlink, Eye, EyeOff, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

// Interface para itens da planilha
interface SpreadsheetItem {
  id: string;
  item: string;
  unid: string;
  qtd: number;
  sceneCollection?: string;
  linked: boolean;
  visible: boolean;
}

// Interface para Scene Collection
interface SceneCollection {
  id: string;
  name: string;
  color: string;
}

interface LinkManagerProps {
  sceneCollections: SceneCollection[];
  onToggleCollectionVisibility: (collectionId: string) => void;
  collectionVisibility: { [key: string]: boolean };
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  sceneCollections,
  onToggleCollectionVisibility,
  collectionVisibility
}) => {
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  // Carregar dados da planilha CSV
  const loadSpreadsheet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('./Etapas.csv');
      if (!response.ok) {
        throw new Error('Arquivo não encontrado');
      }
      
      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      
      // Mapear nomes da planilha para Scene Collections
      const collectionMapping: { [key: string]: string } = {
        'Paredes Terreo': 'GRParedes Terreo',
        'Paredes Pav. Superior': 'GRParedes Pav. Superior',
        'Piso Calçada': 'GRPiso Cal',
        'Piso Térreo': 'GRPiso T',
        'Piso Pav. Superior': 'GRPiso Pav.Superior',
        'Telhado': 'GRTelhado',
        'Esquadrias Terreo': 'GREsquadrias Terreo',
        'Esquadrias Pav.Superior': 'GREsquadrias Pav. Superior',
        'Pergolado': 'GRPergolado'
      };
      
      // Converter CSV para formato de itens
      const items: SpreadsheetItem[] = lines
        .slice(1) // Pular cabeçalho
        .filter(line => line.trim()) // Filtrar linhas vazias
        .map((line, index) => {
          const [item, unid, qtd] = line.split(';');
          const sceneCollection = collectionMapping[item?.trim()] || '';
          
          return {
            id: `item-${index}`,
            item: item?.trim() || '',
            unid: unid?.trim() || '',
            qtd: parseFloat(qtd?.trim()) || 0,
            sceneCollection: sceneCollection,
            linked: !!sceneCollection, // Auto-link se há collection correspondente
            visible: true
          };
        });
      
      setSpreadsheetData(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planilha');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadSpreadsheet();
  }, []);

  // Vincular itens selecionados com a coleção selecionada
  const linkItems = () => {
    if (selectedItems.length === 0 || !selectedCollection) return;
    
    setSpreadsheetData(prev => 
      prev.map(item => 
        selectedItems.includes(item.id)
          ? { ...item, sceneCollection: selectedCollection, linked: true }
          : item
      )
    );
    
    setSelectedItems([]);
    setSelectedCollection('');
  };

  // Desvincular itens selecionados
  const unlinkItems = () => {
    if (selectedItems.length === 0) return;
    
    setSpreadsheetData(prev => 
      prev.map(item => 
        selectedItems.includes(item.id)
          ? { ...item, sceneCollection: '', linked: false }
          : item
      )
    );
    
    setSelectedItems([]);
  };

  // Alternar seleção de item
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Alternar visibilidade de item vinculado
  const toggleItemVisibility = (itemId: string) => {
    setSpreadsheetData(prev => 
      prev.map(item => 
        item.id === itemId
          ? { ...item, visible: !item.visible }
          : item
      )
    );
  };

  // Aplicar visibilidade às coleções vinculadas
  const applyVisibilityToCollections = () => {
    spreadsheetData.forEach(item => {
      if (item.linked && item.sceneCollection) {
        const collection = sceneCollections.find(c => c.id === item.sceneCollection);
        if (collection && collectionVisibility[collection.id] !== item.visible) {
          onToggleCollectionVisibility(collection.id);
        }
      }
    });
  };

  // Aplicar visibilidade quando itens mudarem
  useEffect(() => {
    applyVisibilityToCollections();
  }, [spreadsheetData]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = spreadsheetData.length;
    const linked = spreadsheetData.filter(item => item.linked).length;
    const visible = spreadsheetData.filter(item => item.visible).length;
    const hidden = spreadsheetData.filter(item => !item.visible).length;
    
    return { total, linked, visible, hidden };
  }, [spreadsheetData]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Link Manager</h1>
            <p className="text-gray-600">Vincule itens da planilha com Scene Collections</p>
          </div>
        </div>
        
        <button
          onClick={loadSpreadsheet}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{loading ? 'Carregando...' : 'Recarregar'}</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total de Itens</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.linked}</div>
          <div className="text-sm text-gray-600">Vinculados</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.visible}</div>
          <div className="text-sm text-gray-600">Visíveis</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.hidden}</div>
          <div className="text-sm text-gray-600">Ocultos</div>
        </div>
      </div>

      {/* Controles de Vinculação */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Controles de Vinculação</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scene Collection
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma coleção</option>
              {sceneCollections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={linkItems}
              disabled={selectedItems.length === 0 || !selectedCollection}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Link className="w-4 h-4" />
              <span>Vincular</span>
            </button>
            
            <button
              onClick={unlinkItems}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Unlink className="w-4 h-4" />
              <span>Desvincular</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Itens da Planilha</h3>
        </div>
        
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando planilha...</p>
          </div>
        )}
        
        {error && (
          <div className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadSpreadsheet}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === spreadsheetData.length && spreadsheetData.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(spreadsheetData.map(item => item.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unid</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qtd</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Scene Collection</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {spreadsheetData.map((item) => {
                  const collection = sceneCollections.find(c => c.id === item.sceneCollection);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.item}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.unid}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.qtd}</td>
                      <td className="px-4 py-3">
                        {collection ? (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: collection.color }}
                            />
                            <span className="text-sm text-gray-900">{collection.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Não vinculado</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.linked ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Vinculado</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <XCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Não vinculado</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.linked && (
                          <button
                            onClick={() => toggleItemVisibility(item.id)}
                            className={`p-1 rounded transition-colors ${
                              item.visible
                                ? 'text-blue-600 hover:text-blue-700'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={item.visible ? 'Ocultar' : 'Mostrar'}
                          >
                            {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

