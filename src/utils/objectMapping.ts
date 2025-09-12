// Mapeamento direto de objetos para Scene Collections
// Baseado na análise do arquivo ARQ.glb

export const objectToCollectionMapping = {
  "Paredes Terreo": [
    "Parede básica Alvenaria cerâmica - 15cm",
    "Parede básica Mureta jardim",
    "Parede básica Madeirado"
  ],
  "Paredes Pav. Superior": [
    "Parede básica Platibanda"
  ],
  "Piso Calçada": [
    "Piso Grama",
    "Piso Asfalto"
  ],
  "Piso Térreo": [
    "Piso Laje revestida - Porcelanato 50x50",
    "Piso Contra-Piso",
    "Piso Contrapiso + Porcelanato 50x50"
  ],
  "Piso Pav. Superior": [
    "Piso Laje de Concreto"
  ],
  "Telhado": [
    "Telhado básico Telha Fibrocimento"
  ],
  "Esquadrias Terreo": [
    "Porta de madeira",
    "Sliding Window",
    "Janela Vidro",
    "Painel do sistema Envidraçado"
  ],
  "Esquadrias Pav.Superior": [
    "Porta Pivotante"
  ],
  "Pergolado": [
    "Pilar de concreto",
    "Viga",
    "Montante retangular"
  ]
};

// Função para encontrar a coleção de um objeto
export const findObjectCollection = (objectName) => {
  // Remover IDs únicos do nome (ex: [2638356] Geometry)
  const cleanName = objectName.split(' [')[0];
  
  for (const [collectionName, keywords] of Object.entries(objectToCollectionMapping)) {
    for (const keyword of keywords) {
      if (cleanName.includes(keyword)) {
        return collectionName;
      }
    }
  }
  return null;
};

// Função para obter todos os objetos de uma coleção
export const getCollectionObjects = (collectionName) => {
  return objectToCollectionMapping[collectionName] || [];
};

// Função para verificar se um objeto pertence a uma coleção
export const isObjectInCollection = (objectName, collectionName) => {
  return findObjectCollection(objectName) === collectionName;
};
