// Configuração de texturas para diferentes tipos de materiais
export interface TextureConfig {
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export const textureConfigs: Record<string, TextureConfig> = {
  'Pintura Toque de Brilho cor Clara': {
    name: 'Pintura Toque de Brilho cor Clara',
    color: '#F5F5DC', // Bege claro realista
    roughness: 0.3,
    metalness: 0.0
  },
  'Asfalto': {
    name: 'Asfalto',
    color: '#2F2F2F', // Preto asfalto realista
    roughness: 0.95,
    metalness: 0.0
  },
  'Porcelanato': {
    name: 'Porcelanato',
    color: '#F8F8FF', // Branco porcelanato
    roughness: 0.05,
    metalness: 0.0
  },
  'Telha Fibrocimento': {
    name: 'Telha Fibrocimento',
    color: '#8B0000', // Vermelho telha
    roughness: 0.8,
    metalness: 0.0
  },
  'Vidro': {
    name: 'Vidro',
    color: '#87CEEB', // Azul céu
    roughness: 0.0,
    metalness: 0.0,
    emissive: '#000000',
    emissiveIntensity: 0.0
  },
  'Madeira': {
    name: 'Madeira',
    color: '#8B4513', // Marrom madeira
    roughness: 0.7,
    metalness: 0.0
  },
  // Texturas antigas mantidas para compatibilidade
  'Tijolo': {
    name: 'Tijolo',
    color: '#8B4513', // Marrom tijolo realista
    roughness: 0.8,
    metalness: 0.0
  },
  'Concreto': {
    name: 'Concreto',
    color: '#A9A9A9', // Cinza concreto
    roughness: 0.9,
    metalness: 0.0
  },
  'Telha': {
    name: 'Telha',
    color: '#8B0000', // Vermelho telha
    roughness: 0.8,
    metalness: 0.0
  },
  'Alumínio': {
    name: 'Alumínio',
    color: '#C0C0C0', // Prata alumínio
    roughness: 0.3,
    metalness: 0.8
  },
  'Aço': {
    name: 'Aço',
    color: '#708090', // Cinza aço
    roughness: 0.4,
    metalness: 0.9
  },
  'Default': {
    name: 'Default',
    color: '#808080', // Cinza neutro para elementos não mapeados
    roughness: 0.5,
    metalness: 0.0
  }
};

// Função para obter configuração de textura por nome
export const getTextureConfig = (textureName: string): TextureConfig => {
  return textureConfigs[textureName] || textureConfigs['Default'];
};

// Função para obter cor de textura por nome
export const getTextureColor = (textureName: string): string => {
  return getTextureConfig(textureName).color;
};
