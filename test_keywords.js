import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keywords do mapeamento
const serviceMappings = [
  {
    serviceName: 'Paredes Terreo',
    keywords: ['parede básica alvenaria cerâmica', 'parede básica mureta jardim', 'parede básica madeirado']
  },
  {
    serviceName: 'Paredes Pav. Superior',
    keywords: ['parede básica platibanda']
  },
  {
    serviceName: 'Piso Terreo',
    keywords: ['piso laje revestida', 'piso contrapiso + porcelanato']
  },
  {
    serviceName: 'Piso Pav. Superior',
    keywords: ['piso laje de concreto']
  },
  {
    serviceName: 'Telhado',
    keywords: ['telhado básico telha fibrocimento']
  },
  {
    serviceName: 'Esquadrias Terreo',
    keywords: ['porta de madeira', 'sliding window', 'janela vidro', 'painel do sistema envidraçado']
  },
  {
    serviceName: 'Esquadrias Pav.Superior',
    keywords: ['porta pivotante']
  },
  {
    serviceName: 'Pergolado',
    keywords: ['pilar de concreto', 'viga', 'montante retangular', 'caibro']
  }
];

function testKeywords() {
  console.log('🧪 Testando Keywords vs Nomes Reais dos Objetos');
  console.log('='.repeat(60));

  try {
    const data = fs.readFileSync(path.join(__dirname, 'public', 'ARQ.glb'));
    
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

    if (!jsonData || !jsonData.nodes) {
      console.log('❌ Não foi possível carregar os dados do GLB');
      return;
    }

    // Coletar todos os nomes de objetos
    const allObjectNames = [];
    jsonData.nodes.forEach(node => {
      if (node.name) {
        allObjectNames.push(node.name);
      }
    });

    console.log(`📊 Total de objetos no GLB: ${allObjectNames.length}`);
    console.log();

    // Testar cada serviço
    serviceMappings.forEach(service => {
      console.log(`🔍 Testando: ${service.serviceName}`);
      console.log(`   Keywords: ${service.keywords.join(', ')}`);
      
      let matches = [];
      
      service.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const found = allObjectNames.filter(name => 
          name.toLowerCase().includes(keywordLower)
        );
        matches = matches.concat(found);
      });
      
      // Remover duplicatas
      matches = [...new Set(matches)];
      
      console.log(`   ✅ Objetos encontrados: ${matches.length}`);
      if (matches.length > 0) {
        console.log(`   📝 Exemplos:`);
        matches.slice(0, 3).forEach(match => {
          console.log(`      • ${match}`);
        });
        if (matches.length > 3) {
          console.log(`      ... e mais ${matches.length - 3} objetos`);
        }
      } else {
        console.log(`   ❌ Nenhum objeto encontrado!`);
        
        // Sugerir keywords alternativas
        console.log(`   💡 Sugestões baseadas nos nomes reais:`);
        const suggestions = allObjectNames.filter(name => {
          const nameLower = name.toLowerCase();
          return nameLower.includes(service.serviceName.toLowerCase().split(' ')[0]) ||
                 nameLower.includes('parede') && service.serviceName.includes('Parede') ||
                 nameLower.includes('piso') && service.serviceName.includes('Piso') ||
                 nameLower.includes('telhado') && service.serviceName.includes('Telhado') ||
                 nameLower.includes('porta') && service.serviceName.includes('Esquadria') ||
                 nameLower.includes('janela') && service.serviceName.includes('Esquadria');
        });
        
        if (suggestions.length > 0) {
          suggestions.slice(0, 3).forEach(suggestion => {
            console.log(`      • ${suggestion}`);
          });
        }
      }
      console.log();
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testKeywords();
