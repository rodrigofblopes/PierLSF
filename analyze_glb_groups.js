import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeGLBGroups(filePath) {
  console.log(`Analisando grupos/pastas do arquivo: ${filePath}`);
  console.log('='.repeat(80));

  try {
    const data = fs.readFileSync(filePath);
    
    // Encontrar o chunk JSON
    let offset = 12;
    let jsonData = null;
    
    while (offset < data.length) {
      const chunkLength = data.readUInt32LE(offset);
      const chunkType = data.readUInt32LE(offset + 4);
      
      if (chunkType === 0x4E4F4A47) { // JSON chunk
        const jsonChunk = data.slice(offset + 8, offset + 8 + chunkLength);
        jsonData = JSON.parse(jsonChunk.toString());
        break;
      }
      
      offset += 8 + chunkLength;
    }

    if (!jsonData) {
      console.log('Chunk JSON não encontrado');
      return;
    }

    console.log('Estrutura de Grupos/Pastas encontrada:');
    console.log();

    // Analisar nós e agrupar por prefixo/pasta
    if (jsonData.nodes) {
      const groups = {};
      
      jsonData.nodes.forEach((node, index) => {
        if (node.name) {
          // Tentar identificar grupos por prefixo comum
          const name = node.name;
          
          // Procurar por padrões de grupos
          let groupName = 'Root';
          
          // Verificar se tem prefixo comum (ex: "GRParedes", "GRPiso", etc.)
          if (name.startsWith('GR')) {
            const parts = name.split(' ');
            groupName = parts[0] || 'GR';
          } else if (name.includes('Parede')) {
            groupName = 'Paredes';
          } else if (name.includes('Piso')) {
            groupName = 'Pisos';
          } else if (name.includes('Telhado')) {
            groupName = 'Telhado';
          } else if (name.includes('Porta') || name.includes('Janela')) {
            groupName = 'Esquadrias';
          } else if (name.includes('Pilar') || name.includes('Viga')) {
            groupName = 'Pergolado';
          }
          
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          
          groups[groupName].push({
            name: name,
            hasMesh: node.mesh !== undefined,
            children: node.children ? node.children.length : 0
          });
        }
      });

      // Mostrar grupos encontrados
      Object.keys(groups).sort().forEach(groupName => {
        const items = groups[groupName];
        const meshCount = items.filter(item => item.hasMesh).length;
        
        console.log(`📁 ${groupName}:`);
        console.log(`   Total de itens: ${items.length}`);
        console.log(`   Meshes: ${meshCount}`);
        
        // Mostrar alguns exemplos
        const examples = items.slice(0, 3).map(item => item.name);
        if (examples.length > 0) {
          console.log(`   Exemplos: ${examples.join(', ')}`);
        }
        console.log();
      });
    }

    // Analisar cenas para entender a hierarquia
    if (jsonData.scenes && jsonData.scenes[0]) {
      console.log('Estrutura da Cena Principal:');
      console.log('-'.repeat(40));
      
      const scene = jsonData.scenes[0];
      if (scene.nodes) {
        scene.nodes.forEach((nodeIndex, i) => {
          if (jsonData.nodes && jsonData.nodes[nodeIndex]) {
            const node = jsonData.nodes[nodeIndex];
            console.log(`Node ${i}: ${node.name || 'Unnamed'}`);
            
            if (node.children) {
              node.children.forEach((childIndex, j) => {
                if (jsonData.nodes && jsonData.nodes[childIndex]) {
                  const child = jsonData.nodes[childIndex];
                  console.log(`  └─ Child ${j}: ${child.name || 'Unnamed'}`);
                  
                  if (child.children) {
                    child.children.forEach((grandChildIndex, k) => {
                      if (jsonData.nodes && jsonData.nodes[grandChildIndex]) {
                        const grandChild = jsonData.nodes[grandChildIndex];
                        console.log(`    └─ GrandChild ${k}: ${grandChild.name || 'Unnamed'}`);
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

  } catch (error) {
    console.error('Erro ao analisar arquivo:', error.message);
  }
}

// Analisar o arquivo Pier.glb
const pierPath = path.join(__dirname, 'public', 'Pier.glb');
analyzeGLBGroups(pierPath);
