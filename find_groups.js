import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findGroupsInGLB(filePath) {
  console.log(`Buscando grupos no arquivo: ${filePath}`);
  console.log('='.repeat(60));

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
      console.log('❌ Chunk JSON não encontrado');
      return;
    }

    console.log('✅ JSON carregado com sucesso');
    console.log();

    // Analisar nós e identificar grupos
    if (jsonData.nodes) {
      const groups = {};
      const allNames = [];
      
      jsonData.nodes.forEach((node, index) => {
        if (node.name) {
          allNames.push(node.name);
          
          // Identificar grupos por prefixo
          let groupName = 'Outros';
          
          if (node.name.startsWith('GR')) {
            groupName = 'GR (Scene Collections)';
          } else if (node.name.includes('Parede')) {
            groupName = 'Paredes';
          } else if (node.name.includes('Piso')) {
            groupName = 'Pisos';
          } else if (node.name.includes('Telhado')) {
            groupName = 'Telhado';
          } else if (node.name.includes('Porta') || node.name.includes('Janela')) {
            groupName = 'Esquadrias';
          } else if (node.name.includes('Pilar') || node.name.includes('Viga') || node.name.includes('Caibro')) {
            groupName = 'Pergolado';
          }
          
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          
          groups[groupName].push({
            name: node.name,
            hasMesh: node.mesh !== undefined,
            children: node.children ? node.children.length : 0
          });
        }
      });

      console.log('📁 GRUPOS IDENTIFICADOS:');
      console.log('-'.repeat(40));
      
      Object.keys(groups).sort().forEach(groupName => {
        const items = groups[groupName];
        const meshCount = items.filter(item => item.hasMesh).length;
        
        console.log(`\n${groupName}:`);
        console.log(`  📊 Total: ${items.length} itens`);
        console.log(`  🎯 Meshes: ${meshCount}`);
        
        // Mostrar exemplos únicos
        const uniqueNames = [...new Set(items.map(item => item.name))];
        const examples = uniqueNames.slice(0, 5);
        
        if (examples.length > 0) {
          console.log(`  📝 Exemplos:`);
          examples.forEach(name => {
            console.log(`    • ${name}`);
          });
          if (uniqueNames.length > 5) {
            console.log(`    ... e mais ${uniqueNames.length - 5} itens`);
          }
        }
      });

      console.log('\n' + '='.repeat(60));
      console.log('🔍 ANÁLISE DE PREFIXOS:');
      console.log('-'.repeat(30));
      
      // Analisar prefixos comuns
      const prefixes = {};
      allNames.forEach(name => {
        const parts = name.split(' ');
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
        .slice(0, 10);

      sortedPrefixes.forEach(([prefix, count]) => {
        console.log(`  ${prefix}: ${count} itens`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao analisar arquivo:', error.message);
  }
}

// Analisar o arquivo ARQ.glb
const arqPath = path.join(__dirname, 'public', 'ARQ.glb');
findGroupsInGLB(arqPath);
