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
    color: '#E6DDD4', // Bege escurecido
    roughness: 0.3,
    metalness: 0.0
  },
  'Asfalto': {
    name: 'Asfalto',
    color: '#1A1A1A', // Preto asfalto
    roughness: 0.9,
    metalness: 0.0
  },
  'Porcelanato': {
    name: 'Porcelanato',
    color: '#C8D6E5', // Azul acinzentado escuro
    roughness: 0.05,
    metalness: 0.1
  },
  'Telha Fibrocimento': {
    name: 'Telha Fibrocimento',
    color: '#8B1538', // Vermelho escuro telha
    roughness: 0.7,
    metalness: 0.0
  },
  'Vidro': {
    name: 'Vidro',
    color: '#A8C8EC', // Azul escurecido
    roughness: 0.0,
    metalness: 0.0,
    emissive: '#5F9EA0',
    emissiveIntensity: 0.03
  },
  'Madeira': {
    name: 'Madeira',
    color: '#A0522D', // Marrom escurecido
    roughness: 0.6,
    metalness: 0.0
  },
  // Materiais complementares escurecidos
  'Tijolo': {
    name: 'Tijolo',
    color: '#8B4513', // Marrom tijolo escuro
    roughness: 0.8,
    metalness: 0.0
  },
  'Concreto': {
    name: 'Concreto',
    color: '#A9A9A9', // Cinza médio concreto
    roughness: 0.8,
    metalness: 0.0
  },
  'Telha': {
    name: 'Telha',
    color: '#8B0000', // Vermelho escuro telha
    roughness: 0.7,
    metalness: 0.0
  },
  'Alumínio': {
    name: 'Alumínio',
    color: '#B0C4DE', // Azul aço claro
    roughness: 0.15,
    metalness: 0.9,
    emissive: '#708090',
    emissiveIntensity: 0.01
  },
  'Aço': {
    name: 'Aço',
    color: '#2F4F4F', // Cinza escuro aço
    roughness: 0.3,
    metalness: 0.95,
    emissive: '#36454F',
    emissiveIntensity: 0.02
  },
  'Default': {
    name: 'Default',
    color: '#8B7D6B', // Marrom acinzentado neutro
    roughness: 0.5,
    metalness: 0.0
  },
  // Materiais especiais escurecidos
  'Cerâmica': {
    name: 'Cerâmica',
    color: '#D2B48C', // Bege cerâmica escuro
    roughness: 0.15,
    metalness: 0.0
  },
  'Mármore': {
    name: 'Mármore',
    color: '#D3D3D3', // Cinza claro mármore
    roughness: 0.08,
    metalness: 0.0,
    emissive: '#E5E5E5',
    emissiveIntensity: 0.005
  },
  'Granito': {
    name: 'Granito',
    color: '#2F4F4F', // Cinza escuro granito
    roughness: 0.3,
    metalness: 0.0
  },
  'Cobre': {
    name: 'Cobre',
    color: '#8B4513', // Marrom cobre escuro
    roughness: 0.3,
    metalness: 0.8,
    emissive: '#A0522D',
    emissiveIntensity: 0.02
  },
  'Ferro': {
    name: 'Ferro',
    color: '#4A4A4A', // Cinza escuro ferro
    roughness: 0.6,
    metalness: 0.7
  },
  // Materiais específicos para dutos
  'Dutos': {
    name: 'Dutos',
    color: '#4169E1', // Azul royal para dutos
    roughness: 0.15,
    metalness: 0.7,
    emissive: '#001040',
    emissiveIntensity: 0.05
  },
  'Dutos_Metalico': {
    name: 'Dutos_Metalico',
    color: '#4682B4', // Azul aço para dutos metálicos
    roughness: 0.1,
    metalness: 0.8,
    emissive: '#001040',
    emissiveIntensity: 0.03
  },
  'Dutos_Galvanizado': {
    name: 'Dutos_Galvanizado',
    color: '#708090', // Cinza galvanizado
    roughness: 0.2,
    metalness: 0.6,
    emissive: '#2F4F4F',
    emissiveIntensity: 0.02
  },
  // Materiais específicos para sistema de gás GLP (vermelho intenso)
  'Gas': {
    name: 'Gas',
    color: '#B22222', // Vermelho GLP mais escuro
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#8B0000',
    emissiveIntensity: 0.1
  },
  'Gas_Tubulacao': {
    name: 'Gas_Tubulacao',
    color: '#8B0000', // Vermelho muito escuro para tubulações
    roughness: 0.15,
    metalness: 0.85,
    emissive: '#660000',
    emissiveIntensity: 0.08
  },
  'Gas_Conexao': {
    name: 'Gas_Conexao',
    color: '#DC143C', // Vermelho crimson para conexões
    roughness: 0.2,
    metalness: 0.8,
    emissive: '#B22222',
    emissiveIntensity: 0.08
  },
  'Gas_Valvula': {
    name: 'Gas_Valvula',
    color: '#FF0000', // Vermelho intenso para válvulas
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#DC143C',
    emissiveIntensity: 0.12
  },
  // Materiais específicos para sistema PPCIP (vermelho intenso)
  'PPCIP': {
    name: 'PPCIP',
    color: '#8B0000', // Vermelho escuro PPCIP
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#660000',
    emissiveIntensity: 0.1
  },
  'PPCIP_Sprinkler': {
    name: 'PPCIP_Sprinkler',
    color: '#DC143C', // Vermelho crimson para sprinklers
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#B22222',
    emissiveIntensity: 0.12
  },
  'PPCIP_Hidrante': {
    name: 'PPCIP_Hidrante',
    color: '#FF0000', // Vermelho intenso para hidrantes
    roughness: 0.15,
    metalness: 0.85,
    emissive: '#DC143C',
    emissiveIntensity: 0.1
  },
  'PPCIP_Alarme': {
    name: 'PPCIP_Alarme',
    color: '#B22222', // Vermelho escuro para alarmes
    roughness: 0.2,
    metalness: 0.8,
    emissive: '#8B0000',
    emissiveIntensity: 0.08
  },
  'PPCIP_Tubulacao': {
    name: 'PPCIP_Tubulacao',
    color: '#8B0000', // Vermelho muito escuro para tubulações
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#660000',
    emissiveIntensity: 0.06
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
