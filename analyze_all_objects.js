import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para analisar um arquivo GLB e extrair todos os objetos
function analyzeAllObjects(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // GLB header (12 bytes)
    const magic = buffer.toString('ascii', 0, 4);
    const version = buffer.readUInt32LE(4);
    const length = buffer.readUInt32LE(8);
    
    console.log('=== ANÁLISE COMPLETA DO ARQUIVO GLB ===');
    console.log('Magic:', magic);
    console.log('Version:', version);
    console.log('Length:', length, 'bytes');
    
    if (magic !== 'glTF') {
      console.log('❌ Não é um arquivo GLB válido');
      return;
    }
    
    let offset = 12;
    let chunkIndex = 0;
    
    while (offset < buffer.length) {
      const chunkLength = buffer.readUInt32LE(offset);
      const chunkType = buffer.toString('ascii', offset + 4, offset + 8);
      
      if (chunkType === 'JSON') {
        const jsonData = buffer.toString('utf8', offset + 8, offset + 8 + chunkLength);
        const gltf = JSON.parse(jsonData);
        
        console.log('\n=== TODOS OS OBJETOS ENCONTRADOS ===');
        
        // Analisar todos os meshes e extrair nomes únicos
        if (gltf.meshes) {
          const allObjects = [];
          const objectCounts = {};
          
          gltf.meshes.forEach((mesh, i) => {
            const meshName = mesh.name || 'Sem nome';
            if (meshName !== 'Sem nome') {
              allObjects.push(meshName);
              
              // Contar objetos por tipo
              const baseName = meshName.split(' [')[0]; // Remove IDs únicos
              if (objectCounts[baseName]) {
                objectCounts[baseName]++;
              } else {
                objectCounts[baseName] = 1;
              }
            }
          });
          
          console.log(`\n📊 Total de objetos: ${allObjects.length}`);
          console.log('\n📋 Contagem por tipo de objeto:');
          
          // Ordenar por quantidade
          const sortedCounts = Object.entries(objectCounts)
            .sort(([,a], [,b]) => b - a);
          
          sortedCounts.forEach(([name, count]) => {
            console.log(`  ${name}: ${count} objetos`);
          });
          
          console.log('\n🔍 Todos os nomes únicos de objetos:');
          const uniqueNames = [...new Set(allObjects.map(name => name.split(' [')[0]))];
          uniqueNames.sort().forEach((name, i) => {
            console.log(`${i + 1}. ${name}`);
          });
          
          // Mapear objetos para Scene Collections baseado nos nomes
          console.log('\n🎯 MAPEAMENTO PARA SCENE COLLECTIONS:');
          
          const sceneCollections = {
            'Paredes Terreo': [],
            'Paredes Pav. Supe': [],
            'Piso Calçada': [],
            'Piso Térreo': [],
            'Piso Pav.Superior': [],
            'Telhado Terreo': [],
            'Esquadrias Terreo': [],
            'Esquadrias Pav. Su': [],
            'Pergolado': []
          };
          
          // Mapear cada objeto para sua coleção
          allObjects.forEach(objectName => {
            const baseName = objectName.split(' [')[0];
            
            if (baseName.includes('Parede básica Alvenaria cerâmica') || 
                baseName.includes('Parede básica Mureta jardim') || 
                baseName.includes('Parede básica Madeirado')) {
              sceneCollections['Paredes Terreo'].push(objectName);
            } else if (baseName.includes('Parede básica Platibanda')) {
              sceneCollections['Paredes Pav. Supe'].push(objectName);
            } else if (baseName.includes('Piso Grama') || baseName.includes('Piso Asfalto')) {
              sceneCollections['Piso Calçada'].push(objectName);
            } else if (baseName.includes('Piso Laje revestida') || baseName.includes('Piso Contrapiso')) {
              sceneCollections['Piso Térreo'].push(objectName);
            } else if (baseName.includes('Piso Laje de Concreto')) {
              sceneCollections['Piso Pav.Superior'].push(objectName);
            } else if (baseName.includes('Telhado básico Telha Fibrocimento')) {
              sceneCollections['Telhado Terreo'].push(objectName);
            } else if (baseName.includes('Porta de madeira') || 
                       baseName.includes('Sliding Window') || 
                       baseName.includes('Janela Vidro') || 
                       baseName.includes('Painel do sistema Envidraçado')) {
              sceneCollections['Esquadrias Terreo'].push(objectName);
            } else if (baseName.includes('Porta Pivotante')) {
              sceneCollections['Esquadrias Pav. Su'].push(objectName);
            } else if (baseName.includes('Pilar de concreto') || 
                       baseName.includes('Viga') || 
                       baseName.includes('Montante retangular')) {
              sceneCollections['Pergolado'].push(objectName);
            }
          });
          
          // Mostrar mapeamento
          Object.entries(sceneCollections).forEach(([collection, objects]) => {
            console.log(`\n📁 ${collection}: ${objects.length} objetos`);
            if (objects.length > 0) {
              objects.slice(0, 3).forEach(obj => console.log(`  - ${obj}`));
              if (objects.length > 3) {
                console.log(`  ... e mais ${objects.length - 3} objetos`);
              }
            }
          });
        }
      }
      
      offset += 8 + chunkLength;
      chunkIndex++;
    }
    
  } catch (error) {
    console.log('❌ Erro ao analisar arquivo:', error.message);
  }
}

// Analisar o arquivo Pier.glb
const pierPath = path.join(__dirname, 'public', 'Pier.glb');
console.log('Analisando arquivo Pier.glb:', pierPath);
analyzeAllObjects(pierPath);

