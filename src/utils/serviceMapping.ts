// Mapeamento entre serviços da tabela e Scene Collections do modelo 3D
export interface ServiceMapping {
  serviceName: string;
  sceneCollectionId: string;
  sceneCollectionName: string;
  color: string;
  description: string;
  keywords: string[];
  blenderCollectionName: string; // Nome exato da Scene Collection no Blender
  textureType?: string; // Tipo de textura para renderização
}

export const serviceMappings: ServiceMapping[] = [
  {
    serviceName: 'Paredes Terreo',
    sceneCollectionId: 'GRParedes Terreo',
    sceneCollectionName: 'Paredes Térreo',
    color: '#8B4513',
    description: 'Paredes do pavimento térreo',
    keywords: [
      'ParedeTerreo'
    ],
    blenderCollectionName: 'Paredes Terreo',
    textureType: 'Pintura Toque de Brilho cor Clara'
  },
  {
    serviceName: 'Paredes Pav. Superior',
    sceneCollectionId: 'GRParedes Pav. Superior',
    sceneCollectionName: 'Paredes Pav. Superior',
    color: '#A0522D',
    description: 'Paredes do pavimento superior',
    keywords: [
      'ParedePavSuperior'
    ],
    blenderCollectionName: 'Paredes Pav. Superior',
    textureType: 'Pintura Toque de Brilho cor Clara'
  },
  {
    serviceName: 'Piso Calçada',
    sceneCollectionId: 'GRPiso Cal',
    sceneCollectionName: 'Piso Calçada',
    color: '#696969',
    description: 'Piso da área de calçada',
    keywords: [
      'PisoCalcada'
    ],
    blenderCollectionName: 'Piso Calçada',
    textureType: 'Asfalto'
  },
  {
    serviceName: 'Piso Térreo',
    sceneCollectionId: 'GRPiso T',
    sceneCollectionName: 'Piso Térreo',
    color: '#D2691E',
    description: 'Piso do pavimento térreo',
    keywords: [
      'PisoTerreo'
    ],
    blenderCollectionName: 'Piso Térreo',
    textureType: 'Porcelanato'
  },
  {
    serviceName: 'Piso Pav. Superior',
    sceneCollectionId: 'GRPiso Pav.Superior',
    sceneCollectionName: 'Piso Pav. Superior',
    color: '#CD853F',
    description: 'Piso do pavimento superior',
    keywords: [
      'PisoPavSuperior'
    ],
    blenderCollectionName: 'Piso Pav. Superior',
    textureType: 'Porcelanato'
  },
  {
    serviceName: 'Telhado Terreo',
    sceneCollectionId: 'GRTelhado Terreo',
    sceneCollectionName: 'Telhado Terreo',
    color: '#2F4F4F',
    description: 'Estrutura do telhado térreo',
    keywords: [
      'TelhadoTerreo'
    ],
    blenderCollectionName: 'Telhado Terreo',
    textureType: 'Telha Fibrocimento'
  },
  {
    serviceName: 'Telhado Pav. Superior',
    sceneCollectionId: 'GRTelhado Pav. Superior',
    sceneCollectionName: 'Telhado Pav. Superior',
    color: '#1C3A3A',
    description: 'Estrutura do telhado pavimento superior',
    keywords: [
      'TelhadoPavSuperior'
    ],
    blenderCollectionName: 'Telhado Pav. Superior',
    textureType: 'Telha Fibrocimento'
  },
  {
    serviceName: 'Esquadrias Terreo',
    sceneCollectionId: 'GREsquadrias Terreo',
    sceneCollectionName: 'Esquadrias Térreo',
    color: '#4169E1',
    description: 'Portas e janelas do térreo',
    keywords: [
      'EsquadriasTerreo'
    ],
    blenderCollectionName: 'Esquadrias Terreo',
    textureType: 'Vidro'
  },
  {
    serviceName: 'Esquadrias Pav.Superior',
    sceneCollectionId: 'GREsquadrias Pav. Superior',
    sceneCollectionName: 'Esquadrias Pav. Superior',
    color: '#1E90FF',
    description: 'Portas e janelas do pavimento superior',
    keywords: [
      'EsquadriasPavSuperior'
    ],
    blenderCollectionName: 'Esquadrias Pav. Superior',
    textureType: 'Vidro'
  },
  {
    serviceName: 'Pergolado',
    sceneCollectionId: 'GRPergolado',
    sceneCollectionName: 'Pergolado',
    color: '#228B22',
    description: 'Estrutura do pergolado',
    keywords: [
      'Pergolado'
    ],
    blenderCollectionName: 'Pergolado',
    textureType: 'Madeira'
  }
];

// Função para encontrar o mapeamento de um serviço
export const findServiceMapping = (serviceName: string): ServiceMapping | undefined => {
  return serviceMappings.find(mapping => 
    mapping.serviceName.toLowerCase() === serviceName.toLowerCase()
  );
};

// Função para obter todas as Scene Collections
export const getAllSceneCollections = (): ServiceMapping[] => {
  return serviceMappings;
};

// Função para verificar se um objeto pertence a uma Scene Collection
export const isObjectInCollection = (objectName: string, collectionName: string): boolean => {
  const mapping = serviceMappings.find(m => m.blenderCollectionName === collectionName);
  if (!mapping) return false;
  
  // Verificar se o nome do objeto contém alguma das keywords da coleção
  return mapping.keywords.some(keyword => 
    objectName.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Função para obter a coleção de um objeto
export const getObjectCollection = (objectName: string): ServiceMapping | undefined => {
  console.log(`🔍 Buscando coleção para objeto: ${objectName}`);
  
  const result = serviceMappings.find(mapping => {
    const match = mapping.keywords.some(keyword => {
      const objectLower = objectName.toLowerCase();
      const keywordLower = keyword.toLowerCase();
      const found = objectLower.includes(keywordLower);
      if (found) {
        console.log(`✅ Match encontrado: ${objectName} contém ${keyword}`);
      }
      return found;
    });
    return match;
  });
  
  if (result) {
    console.log(`🎯 Coleção encontrada: ${result.serviceName} com textura: ${result.textureType}`);
  } else {
    console.log(`❌ Nenhuma coleção encontrada para: ${objectName}`);
  }
  
  return result;
};
