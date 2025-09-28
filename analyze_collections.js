import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeCollections() {
  console.log('Analisando coleções do arquivo GLB');
  console.log('='.repeat(80));

  try {
    // Carregar o arquivo de estrutura JSON
    const structurePath = path.join(__dirname, 'glb_structure.json');
    const jsonData = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

    console.log('✅ Estrutura JSON carregada com sucesso');
    console.log(`📊 Total de nós: ${jsonData.nodes ? jsonData.nodes.length : 0}`);
    console.log();

    // Analisar a estrutura hierárquica
    if (jsonData.nodes && jsonData.scenes) {
      console.log('🏗️ ESTRUTURA HIERÁRQUICA:');
      console.log('-'.repeat(50));
      
      const scene = jsonData.scenes[0];
      if (scene.nodes) {
        console.log(`📁 Cena Principal (${scene.nodes.length} nós raiz):`);
        
        scene.nodes.forEach((nodeIndex, i) => {
          if (jsonData.nodes && jsonData.nodes[nodeIndex]) {
            const node = jsonData.nodes[nodeIndex];
            console.log(`\n  ${i + 1}. ${node.name || 'Unnamed'} (Node ${nodeIndex})`);
            
            if (node.children && node.children.length > 0) {
              console.log(`     └─ ${node.children.length} filhos:`);
              
              node.children.forEach((childIndex, j) => {
                if (jsonData.nodes && jsonData.nodes[childIndex]) {
                  const child = jsonData.nodes[childIndex];
                  console.log(`        ${j + 1}. ${child.name || 'Unnamed'} (Node ${childIndex})`);
                  
                  if (child.children && child.children.length > 0) {
                    console.log(`           └─ ${child.children.length} netos:`);
                    
                    child.children.forEach((grandChildIndex, k) => {
                      if (jsonData.nodes && jsonData.nodes[grandChildIndex]) {
                        const grandChild = jsonData.nodes[grandChildIndex];
                        console.log(`              ${k + 1}. ${grandChild.name || 'Unnamed'} (Node ${grandChildIndex})`);
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }

    // Identificar coleções por padrões de nome
    console.log('\n📁 IDENTIFICAÇÃO DE COLEÇÕES:');
    console.log('-'.repeat(50));
    
    const collections = {};
    const allNames = [];
    
    if (jsonData.nodes) {
      jsonData.nodes.forEach((node, index) => {
        if (node.name) {
          allNames.push(node.name);
          
          // Identificar coleções por padrões
          let collectionName = 'Outros';
          
          // Procurar por prefixos de coleção
          if (node.name.startsWith('ParedeTerreo')) {
            collectionName = 'Paredes Térreo';
          } else if (node.name.startsWith('ParedePav')) {
            collectionName = 'Paredes Pavimento Superior';
          } else if (node.name.startsWith('PisoCalçada')) {
            collectionName = 'Piso Calçada';
          } else if (node.name.startsWith('PisoTerreo')) {
            collectionName = 'Piso Térreo';
          } else if (node.name.startsWith('PisoPav')) {
            collectionName = 'Piso Pavimento Superior';
          } else if (node.name.startsWith('TelhadoTerreo')) {
            collectionName = 'Telhado Térreo';
          } else if (node.name.startsWith('EsquadriasTerreo')) {
            collectionName = 'Esquadrias Térreo';
          } else if (node.name.startsWith('EsquadriasPav')) {
            collectionName = 'Esquadrias Pavimento Superior';
          } else if (node.name.startsWith('Pergolado')) {
            collectionName = 'Pergolado';
          } else if (node.name.includes('AÇO')) {
            collectionName = 'Estrutura Metálica';
          } else if (node.name.includes('Parede')) {
            collectionName = 'Paredes';
          } else if (node.name.includes('Piso')) {
            collectionName = 'Pisos';
          } else if (node.name.includes('Telhado')) {
            collectionName = 'Telhado';
          } else if (node.name.includes('Porta') || node.name.includes('Janela')) {
            collectionName = 'Esquadrias';
          }
          
          if (!collections[collectionName]) {
            collections[collectionName] = [];
          }
          
          collections[collectionName].push({
            name: node.name,
            index: index,
            hasMesh: node.mesh !== undefined,
            children: node.children ? node.children.length : 0
          });
        }
      });

      // Mostrar coleções encontradas
      Object.keys(collections).sort().forEach(collectionName => {
        const items = collections[collectionName];
        const meshCount = items.filter(item => item.hasMesh).length;
        
        console.log(`\n📁 ${collectionName}:`);
        console.log(`   📊 Total: ${items.length} itens`);
        console.log(`   🎯 Meshes: ${meshCount}`);
        
        // Mostrar alguns exemplos
        const examples = items.slice(0, 3).map(item => item.name);
        if (examples.length > 0) {
          console.log(`   📝 Exemplos:`);
          examples.forEach(name => {
            console.log(`      • ${name}`);
          });
          if (items.length > 3) {
            console.log(`      ... e mais ${items.length - 3} itens`);
          }
        }
      });
    }

    // Analisar prefixos comuns
    console.log('\n🔍 ANÁLISE DE PREFIXOS:');
    console.log('-'.repeat(30));
    
    const prefixes = {};
    allNames.forEach(name => {
      const parts = name.split('.');
      if (parts.length > 0) {
        const prefix = parts[0];
        if (!prefixes[prefix]) {
          prefixes[prefix] = 0;
        }
        prefixes[prefix]++;
      }
    });

    // Mostrar prefixos mais comuns
    const sortedPrefixes = Object.entries(prefixes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);

    sortedPrefixes.forEach(([prefix, count]) => {
      console.log(`  ${prefix}: ${count} itens`);
    });

  } catch (error) {
    console.error('❌ Erro ao analisar arquivo:', error.message);
  }
}

analyzeCollections();
