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
    serviceName: 'Flutuante',
    sceneCollectionId: 'GRFlutuante',
    sceneCollectionName: 'Fundação Flutuante',
    color: '#0066CC',
    description: 'Fundação Flutuante - elementos estruturais principais',
    keywords: [
      'Flutuante',
      'flutuante',
      'AÇO - PILAR STEEL FRAME',
      'AÇO - VIGA STEEL FRAME',
      'AÇO - PISO STEEL DECK',
      'Steel Frame',
      'STEEL FRAME'
    ],
    blenderCollectionName: 'Fundação Flutuante',
    textureType: 'Original'
  },
  {
    serviceName: 'Estrutura',
    sceneCollectionId: 'GREstrutura',
    sceneCollectionName: 'Estrutura',
    color: '#FF6B35',
    description: 'Estrutura principal - elementos estruturais secundários',
    keywords: [
      'Guarda-corpo',
      'corrimão',
      'Escada',
      'Water tank'
    ],
    blenderCollectionName: 'Estrutura',
    textureType: 'Original'
  },
  {
    serviceName: 'Piso',
    sceneCollectionId: 'GRPiso',
    sceneCollectionName: 'Piso',
    color: '#2E8B57',
    description: 'Elementos de piso - pisos e pavimentos',
    keywords: [
      'Piso int - PORCELLANATO',
      'PORCELLANATO',
      'Piso int',
      'Piso',
      'piso'
    ],
    blenderCollectionName: 'Piso',
    textureType: 'Original'
  },
  {
    serviceName: 'Parede',
    sceneCollectionId: 'GRParede',
    sceneCollectionName: 'Parede',
    color: '#FFFFFF',
    description: 'Elementos de parede - paredes e divisórias',
    keywords: [
      'Parede básica int - DRY WALL',
      'DRY WALL',
      'Parede básica',
      'Parede',
      'parede'
    ],
    blenderCollectionName: 'Parede',
    textureType: 'Original'
  },
  {
    serviceName: 'Esquadrias',
    sceneCollectionId: 'GREsquadrias',
    sceneCollectionName: 'Esquadrias',
    color: '#FF1493',
    description: 'Esquadrias - portas, janelas e aberturas',
    keywords: [
      'Janela',
      'Porta de alumínio',
      'Esquadria',
      'Basculante',
      'Correr'
    ],
    blenderCollectionName: 'Esquadrias',
    textureType: 'Alumínio Rosa'
  },
  {
    serviceName: 'Cobertura',
    sceneCollectionId: 'GRCobertura',
    sceneCollectionName: 'Cobertura',
    color: '#808080',
    description: 'Elementos de cobertura - telhados e telhas',
    keywords: [
      'Telhado básico TELHA DE FIBROCIMENTO',
      'TELHA DE FIBROCIMENTO',
      'Telhado básico',
      'Cobertura',
      'cobertura'
    ],
    blenderCollectionName: 'Cobertura',
    textureType: 'Telha Vermelha'
  },
  {
    serviceName: 'Forro',
    sceneCollectionId: 'GRForro',
    sceneCollectionName: 'Forro',
    color: '#DDA0DD',
    description: 'Elementos de forro - forros e tetos',
    keywords: [
      'Forro',
      'forro',
      'Teto',
      'teto',
      'Gesso',
      'gesso'
    ],
    blenderCollectionName: 'Forro',
    textureType: 'Original'
  },
  {
    serviceName: 'Guarda-Corpo',
    sceneCollectionId: 'GRGuardaCorpo',
    sceneCollectionName: 'Guarda-Corpo',
    color: '#87CEEB',
    description: 'Elementos de guarda-corpo - proteções e corrimões em vidro',
    keywords: [
      'Guarda-Corpo',
      'guarda-corpo',
      'Guarda Corpo',
      'guarda corpo',
      'Corrimão',
      'corrimão',
      'Proteção',
      'proteção'
    ],
    blenderCollectionName: 'Guarda-Corpo',
    textureType: 'Vidro'
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
  const objectLower = objectName.toLowerCase();
  
  // Buscar por matches específicos primeiro
  for (const mapping of serviceMappings) {
    for (const keyword of mapping.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Match exato
      if (objectLower === keywordLower) {
        return mapping;
      }
      
      // Match que comece com a keyword seguida de ponto
      if (objectLower.startsWith(keywordLower + '.')) {
        return mapping;
      }
      
      // Para "Flutuante", verificar se contém "flutuante"
      if (mapping.serviceName === 'Flutuante' && objectLower.includes('flutuante')) {
        return mapping;
      }
      
      // Para "Estrutura" simples, verificar se contém "estrutura" mas NÃO "flutuante"
      if (mapping.serviceName === 'Estrutura' && objectLower.includes('estrutura') && !objectLower.includes('flutuante')) {
        return mapping;
      }
      
      // Para outras disciplinas, usar match simples
      if (mapping.serviceName !== 'Flutuante' && mapping.serviceName !== 'Estrutura') {
        if (objectLower.includes(keywordLower)) {
          return mapping;
        }
      }
    }
  }
  
  return undefined;
};
