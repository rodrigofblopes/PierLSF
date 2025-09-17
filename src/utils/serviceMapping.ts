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
    serviceName: 'Arquitetura',
    sceneCollectionId: 'GRArquitetura',
    sceneCollectionName: 'Arquitetura',
    color: '#FF8C00',
    description: 'Elementos arquitetônicos - paredes, pisos, telhados e esquadrias',
    keywords: [
      'Arquitetura'
    ],
    blenderCollectionName: 'Arquitetura',
    textureType: 'Múltiplas texturas'
  },
  {
    serviceName: 'Eletrica',
    sceneCollectionId: 'GREletrica',
    sceneCollectionName: 'Instalação Elétrica',
    color: '#FF6600',
    description: 'Sistema elétrico - dispositivos LED e iluminação',
    keywords: [
      'Eletrica'
    ],
    blenderCollectionName: 'Eletrica',
    textureType: 'Metálico Laranja'
  },
  {
    serviceName: 'Dutos',
    sceneCollectionId: 'GRDutos',
    sceneCollectionName: 'Sistema de Dutos',
    color: '#4169E1',
    description: 'Sistema de dutos - ventilação e ar condicionado',
    keywords: [
      'Dutos'
    ],
    blenderCollectionName: 'Dutos',
    textureType: 'Metálico Azul'
  },
  {
    serviceName: 'Hidrosanitario',
    sceneCollectionId: 'GRHidrosanitario',
    sceneCollectionName: 'Hidrossanitário',
    color: '#228B22',
    description: 'Sistema hidrossanitário - tubulações, sanitários e drenagem',
    keywords: [
      'Hidrosanitario'
    ],
    blenderCollectionName: 'Hidrosanitario',
    textureType: 'PVC Verde'
  },
  {
    serviceName: 'Incendio',
    sceneCollectionId: 'GRIncendio',
    sceneCollectionName: 'Sistema de Incêndio',
    color: '#FF1493',
    description: 'Sistema de proteção contra incêndio',
    keywords: [
      'Incendio'
    ],
    blenderCollectionName: 'Incendio',
    textureType: 'Metálico Vermelho'
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
  const result = serviceMappings.find(mapping => {
    const match = mapping.keywords.some(keyword => {
      const objectLower = objectName.toLowerCase();
      const keywordLower = keyword.toLowerCase();
      return objectLower.includes(keywordLower);
    });
    return match;
  });
  
  return result;
};
