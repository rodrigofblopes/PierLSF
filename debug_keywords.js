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

function debugKeywords() {
  console.log('🔍 Debug: Testando Keywords');
  console.log('='.repeat(50));

  // Nomes reais que sabemos que existem (baseado na análise anterior)
  const realObjectNames = [
    'Parede básica Alvenaria cerâmica - 15cm [2638356]',
    'Parede básica Mureta jardim [2610248]',
    'Parede básica Madeirado [2610667]',
    'Parede básica Platibanda [2607264]',
    'Piso Laje revestida - Porcelanato 50x50 [2602960]',
    'Piso Contrapiso + Porcelanato 50x50 [2604349]',
    'Piso Laje de Concreto [2607723]',
    'Telhado básico Telha Fibrocimento [2606146]',
    'Porta de madeira (Abrir) - Modelo 4 0.60x2.10 [2601060]',
    'Porta de madeira (Abrir) - Modelo 4 0.80x2.10 [2600835]'
  ];

  console.log('📋 Nomes reais dos objetos:');
  realObjectNames.forEach(name => {
    console.log(`  • ${name}`);
  });
  console.log();

  // Testar cada serviço
  serviceMappings.forEach(service => {
    console.log(`🎯 Testando: ${service.serviceName}`);
    console.log(`   Keywords: ${service.keywords.join(', ')}`);
    
    let matches = [];
    
    service.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const found = realObjectNames.filter(name => 
        name.toLowerCase().includes(keywordLower)
      );
      matches = matches.concat(found);
    });
    
    // Remover duplicatas
    matches = [...new Set(matches)];
    
    console.log(`   ✅ Objetos encontrados: ${matches.length}`);
    if (matches.length > 0) {
      console.log(`   📝 Matches:`);
      matches.forEach(match => {
        console.log(`      • ${match}`);
      });
    } else {
      console.log(`   ❌ Nenhum match encontrado!`);
      
      // Tentar matches parciais
      console.log(`   🔍 Tentando matches parciais:`);
      service.keywords.forEach(keyword => {
        const keywordWords = keyword.toLowerCase().split(' ');
        keywordWords.forEach(word => {
          if (word.length > 3) { // Ignorar palavras muito curtas
            const partialMatches = realObjectNames.filter(name => 
              name.toLowerCase().includes(word)
            );
            if (partialMatches.length > 0) {
              console.log(`      Palavra "${word}": ${partialMatches.length} matches`);
              partialMatches.slice(0, 2).forEach(match => {
                console.log(`        • ${match}`);
              });
            }
          }
        });
      });
    }
    console.log();
  });

  console.log('💡 Sugestões de keywords corrigidas:');
  console.log('-'.repeat(40));
  
  const correctedKeywords = [
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
      keywords: ['porta de madeira']
    }
  ];

  correctedKeywords.forEach(service => {
    console.log(`${service.serviceName}:`);
    service.keywords.forEach(keyword => {
      console.log(`  • "${keyword}"`);
    });
  });
}

debugKeywords();
