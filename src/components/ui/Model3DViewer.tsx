import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Group, Mesh } from 'three';
import * as THREE from 'three';
import { ServiceMapping, getObjectCollection } from '@/utils/serviceMapping';

// Hook para detectar dispositivo móvel
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// Iluminação otimizada e profissional
function MobileLighting() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <>
        <ambientLight intensity={0.2} color="#ffffff" />
        <directionalLight
          position={[60, 60, 30]}
          intensity={0.6}
          color="#ffffff"
          castShadow={true}
        />
        <directionalLight
          position={[-40, 40, -20]}
          intensity={0.3}
          color="#ffffff"
        />
        <directionalLight
          position={[0, 50, 40]}
          intensity={0.2}
          color="#ffffff"
        />
        <directionalLight
          position={[30, 20, -30]}
          intensity={0.15}
          color="#FFE4B5"
        />
        <hemisphereLight
          args={["#87CEEB", "#8B7355", 0.15]}
        />
        <pointLight
          position={[0, 40, 0]}
          intensity={0.1}
          color="#FFD700"
          distance={150}
          decay={2}
        />
      </>
    );
  }
  
  return (
    <>
      <ambientLight intensity={0.15} color="#ffffff" />
      <directionalLight
        position={[80, 80, 40]}
        intensity={0.8}
        color="#ffffff"
        castShadow={true}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <directionalLight
        position={[-60, 60, -30]}
        intensity={0.4}
        color="#ffffff"
      />
      <directionalLight
        position={[0, 70, 60]}
        intensity={0.25}
        color="#ffffff"
      />
      <directionalLight
        position={[40, 30, -50]}
        intensity={0.2}
        color="#FFE4B5"
      />
      <hemisphereLight
        args={["#87CEEB", "#8B7355", 0.2]}
      />
      <pointLight
        position={[0, 50, 0]}
        intensity={0.15}
        color="#FFD700"
        distance={200}
        decay={2}
      />
    </>
  );
}

// Componente do modelo 3D
function Model3D({ 
  modelPath, 
  selectedService, 
  selectedElements3d, 
  hiddenServices 
}: {
  modelPath: string;
  selectedService: ServiceMapping | null;
  selectedElements3d: string[];
  hiddenServices: string[];
}) {
  const modelRef = useRef<Group>(null);
  const originalMaterials = useRef(new Map<Mesh, THREE.Material>());
  const highlightedMaterials = useRef(new Map<Mesh, THREE.Material>());
  
  // Função para criar material de vidro realista
  const createGlassMaterial = (baseMaterial: THREE.Material): THREE.Material => {
    const glassMaterial = baseMaterial.clone();
    
    // Propriedades do vidro
    glassMaterial.color.setHex(0xE6F3FF); // Azul muito claro
    glassMaterial.transparent = true;
    glassMaterial.opacity = 0.1; // Muito transparente
    glassMaterial.metalness = 0.0; // Não metálico
    glassMaterial.roughness = 0.0; // Superfície perfeitamente lisa
    glassMaterial.envMapIntensity = 3.0; // Reflexão intensa
    glassMaterial.refractionRatio = 0.98; // Índice de refração do vidro
    glassMaterial.side = THREE.DoubleSide; // Renderizar ambos os lados
    glassMaterial.depthWrite = false; // Não escrever no depth buffer
    glassMaterial.depthTest = true; // Teste de profundidade
    glassMaterial.blending = THREE.NormalBlending; // Blending normal
    
    return glassMaterial;
  };
  
  // Usar o caminho do modelo diretamente
  const actualModelPath = modelPath;
  console.log('🔍 Caminho do modelo:', actualModelPath);
  
  // Preload com tratamento de erro
  try {
    useGLTF.preload(actualModelPath);
    console.log('✅ Preload do modelo iniciado');
  } catch (error) {
    console.error('❌ Erro no preload do modelo:', error);
  }
  
  // Carregar modelo com tratamento de erro
  let scene;
  try {
    const gltf = useGLTF(actualModelPath);
    scene = gltf.scene;
    console.log('✅ Modelo GLB carregado via useGLTF');
  } catch (error) {
    console.error('❌ Erro ao carregar modelo GLB:', error);
    scene = null;
  }
  
  // Debug: verificar se o modelo foi carregado
  useEffect(() => {
    console.log('🔍 Verificando carregamento do modelo...');
    console.log('🔍 Caminho completo:', window.location.origin + actualModelPath);
    console.log('🔍 Scene existe?', !!scene);
    console.log('🔍 Scene type:', typeof scene);
    
    if (scene) {
      console.log('✅ Modelo GLB carregado com sucesso:', scene);
      console.log('📊 Número de objetos na cena:', scene.children.length);
      console.log('📊 Nome da cena:', scene.name);
      console.log('📊 UUID da cena:', scene.uuid);
      
      // Contar objetos por tipo
      let meshCount = 0;
      let groupCount = 0;
      let otherCount = 0;
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshCount++;
        } else if (child instanceof THREE.Group) {
          groupCount++;
        } else {
          otherCount++;
        }
      });
      
      console.log(`📊 Estatísticas: ${meshCount} meshes, ${groupCount} groups, ${otherCount} outros`);
      
      // Debug dos primeiros 10 objetos com materiais
      let objectCount = 0;
      scene.traverse((child) => {
        if (objectCount < 10) {
          console.log(`🔍 Objeto ${objectCount + 1}: ${child.name} (${child.type})`);
          if (child instanceof THREE.Mesh) {
            console.log(`   Material:`, child.material);
            if (child.material && child.material.color) {
              console.log(`   Cor:`, child.material.color.getHexString());
            }
            if (child.material && child.material.map) {
              console.log(`   Textura:`, child.material.map);
            }
          }
          objectCount++;
        }
      });
    } else {
      console.log('❌ Modelo GLB não foi carregado');
      console.log('❌ Verifique se o arquivo existe em:', actualModelPath);
    }
  }, [scene, actualModelPath]);
  
  // Função para destacar elementos específicos
  const highlightElements = useCallback((elements: string[]) => {
    console.log('🎯 highlightElements chamada com:', elements);
    console.log('📊 Total de elementos para destacar:', elements.length);
    console.log('🔍 Primeiros 5 elementos:', elements.slice(0, 5));
    if (!modelRef.current || !Array.isArray(elements) || elements.length === 0) {
      console.log('❌ Condições não atendidas para highlightElements');
      return;
    }
    
    // Primeiro, restaurar todos os materiais originais (com cores personalizadas)
    originalMaterials.current.forEach((material, mesh) => {
      if (mesh.material !== material) {
        mesh.material = material;
      }
    });
    
    // Limpar apenas os materiais destacados, preservando os originais
    highlightedMaterials.current.forEach((material) => {
      material.dispose();
    });
    highlightedMaterials.current.clear();
    
    // Se não há elementos para destacar, restaurar todos os materiais originais
    if (elements.length === 0) {
      console.log('📝 Nenhum elemento para destacar - mantendo cores originais');
      return;
    }
    
    let highlightedCount = 0;
    
    // Destacar elementos específicos
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const objectName = child.name.toLowerCase();
        
         // Log dos objetos que contêm "estrutura" para debug
         if (child.name.toLowerCase().includes('estrutura')) {
           console.log(`🔍 Objeto 3D com "estrutura": "${child.name}"`);
         }
         
         // Log específico para objetos que começam com "Flutuante"
         if (child.name.toLowerCase().startsWith('flutuante')) {
           console.log(`🎯 Objeto que começa com "Flutuante": "${child.name}"`);
         }
         
         // Log para objetos de Piso, Parede e Cobertura
         if (child.name.toLowerCase().includes('piso') || 
             child.name.toLowerCase().includes('parede') || 
             child.name.toLowerCase().includes('telhado')) {
           console.log(`🏠 Objeto 3D (Piso/Parede/Cobertura): "${child.name}"`);
         }
        
        // Verificar se este objeto está na lista de elementos selecionados
        const isSelected = elements.some(element => {
          const elementLower = element.toLowerCase();
          
          // Log apenas para elementos que contêm "flutuante" para não sobrecarregar
          if (elementLower.includes('flutuante')) {
            console.log(`🔍 Comparando: "${objectName}" com "${elementLower}"`);
          }
          
          // Lógica de matching melhorada
          let match = false;
          
          // Match exato
          if (objectName === elementLower) {
            match = true;
          }
          // Match se o objeto contém o elemento
          else if (objectName.includes(elementLower)) {
            match = true;
          }
          // Match se o elemento contém o objeto (para casos como "Estrutura Flutuante.001")
          else if (elementLower.includes(objectName)) {
            match = true;
          }
          // Match especial para "Flutuante" - normalizar espaços e underscores
          else if (elementLower === 'flutuante' && objectName.startsWith('flutuante')) {
            match = true;
          }
          // Match para elementos com pontos vs underscores
          else if (elementLower.includes('flutuante') && objectName.includes('flutuante')) {
            // Extrair número do elemento (ex: "Flutuante.001" -> "001")
            const elementNumber = elementLower.replace('flutuante', '').replace('.', '');
            const objectNumber = objectName.replace('flutuante', '');
            
            if (elementNumber === objectNumber) {
              match = true;
            }
          }
          
          if (match && elementLower.includes('flutuante')) {
            console.log(`✅ Match encontrado: "${objectName}" <-> "${elementLower}"`);
          }
          
          return match;
        });
        
        if (isSelected) {
          highlightedCount++;
          console.log(`✅ Destacando objeto: ${child.name}`);
          
          // Salvar material original se ainda não foi salvo
          if (!originalMaterials.current.has(child)) {
            originalMaterials.current.set(child, child.material);
          }
          
          // Criar e salvar material destacado
          const highlightMaterial = new THREE.MeshBasicMaterial({
            color: '#FF8C00', // Cor laranja para destaque
            transparent: true,
            opacity: 0.9,
            wireframe: false
          });
          
          console.log(`🎨 Aplicando material laranja ao objeto: ${child.name}`);
          highlightedMaterials.current.set(child, highlightMaterial);
          child.material = highlightMaterial;
          console.log(`✅ Material aplicado com sucesso ao objeto: ${child.name}`);
        }
      }
    });
    
    console.log(`🎯 Total de objetos destacados: ${highlightedCount}`);
  }, [selectedService]);

  // Função para restaurar materiais originais
  const restoreOriginalMaterials = useCallback(() => {
    console.log('🔄 Restaurando materiais originais...');
    originalMaterials.current.forEach((material, mesh) => {
      if (mesh.material !== material) {
        console.log(`🔄 Restaurando material original para: ${mesh.name}`);
        mesh.material = material;
      }
    });
    
    // Dispose apenas dos materiais destacados
    highlightedMaterials.current.forEach((material) => {
      material.dispose();
    });
    
    // Limpar apenas os materiais destacados, preservando os originais
    highlightedMaterials.current.clear();
    console.log('✅ Materiais originais restaurados');
  }, []);

  // Função para ocultar/mostrar serviços
  const toggleServiceVisibility = useCallback((serviceName: string, hidden: boolean) => {
    console.log(`👁️ toggleServiceVisibility chamada: serviceName="${serviceName}", hidden=${hidden}`);
    if (!modelRef.current) {
      console.log('❌ modelRef.current não existe');
      return;
    }
    
    let processedObjects = 0;
    let hiddenObjects = 0;
    
     modelRef.current.traverse((child) => {
       if (child instanceof THREE.Mesh) {
         processedObjects++;
         const serviceMapping = getObjectCollection(child.name);
         
         // Log específico para Piso, Parede e Cobertura
         if (serviceName === 'Piso' || serviceName === 'Parede' || serviceName === 'Cobertura') {
           console.log(`🔍 Verificando objeto: "${child.name}" -> mapping:`, serviceMapping);
         }
         
         if (serviceMapping && serviceMapping.serviceName === serviceName) {
           console.log(`🎯 Objeto encontrado: ${child.name} -> ${serviceMapping.serviceName}, ocultando: ${hidden}`);
           child.visible = !hidden;
           if (hidden) hiddenObjects++;
         }
       }
     });
    
    console.log(`📊 Processados ${processedObjects} objetos, ${hiddenObjects} objetos ocultados para serviço "${serviceName}"`);
  }, []);

  // Salvar materiais originais e aplicar cores quando o modelo carrega
  useEffect(() => {
    if (modelRef.current) {
      console.log('🔍 Salvando materiais originais e aplicando cores...');
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          // Log do nome do objeto para debug
          console.log(`🔍 Analisando objeto: "${child.name}"`);
          
          // Aplicar cores específicas para cada grupo de elementos
          let serviceMapping = null;
          
          // Flutuante - Azul
          if (child.name.toLowerCase().includes('flutuante')) {
            serviceMapping = { serviceName: 'Flutuante', color: '#0066CC' };
            console.log(`✅ Flutuante detectada: ${child.name}`);
          }
          // Estrutura - Cinza metálico
          else if (child.name.toLowerCase() === 'estrutura' || 
                   (child.name.toLowerCase().includes('estrutura') && 
                    !child.name.toLowerCase().includes('flutuante'))) {
            serviceMapping = { serviceName: 'Estrutura', color: '#C0C0C0' };
            console.log(`✅ Estrutura detectada: ${child.name}`);
          }
          // Piso - Branco (porcelanato)
          else if (child.name.toLowerCase().includes('piso')) {
            serviceMapping = { serviceName: 'Piso', color: '#FFFFFF' };
            console.log(`✅ Piso detectado: ${child.name}`);
          }
          // Parede - Bege
          else if (child.name.toLowerCase().includes('parede')) {
            serviceMapping = { serviceName: 'Parede', color: '#F5F5DC' };
            console.log(`✅ Parede detectada: ${child.name}`);
          }
          // Esquadrias - Textura espelho (prata brilhante)
          else if (child.name.toLowerCase().includes('esquadria')) {
            serviceMapping = { serviceName: 'Esquadrias', color: '#E6E6FA' };
            console.log(`✅ Esquadrias detectada: ${child.name}`);
          }
          // Cobertura - Cinza
          else if (child.name.toLowerCase().includes('telhado') || 
                   child.name.toLowerCase().includes('telha')) {
            serviceMapping = { serviceName: 'Cobertura', color: '#808080' };
            console.log(`✅ Cobertura detectada: ${child.name}`);
          }
          else {
            console.log(`⚪ Objeto sem cor personalizada: ${child.name} (mantém cor original)`);
          }
          
          if (serviceMapping) {
            console.log(`🎨 Aplicando cor ${serviceMapping.color} ao objeto ${child.name} (${serviceMapping.serviceName})`);
            
            // Aplicar cor baseada no mapeamento do serviço
            if (child.material) {
              // Verificar se é um array de materiais ou material único
              if (Array.isArray(child.material)) {
                // Para arrays de materiais, aplicar cor a todos
                const coloredMaterials = child.material.map(mat => {
                  const coloredMat = mat.clone();
                  
                  // Aplicar textura de vidro para Guarda-Corpo
                  if (serviceMapping.serviceName === 'Guarda-Corpo' && serviceMapping.textureType === 'Vidro') {
                    // Usar função de vidro realista
                    const glassMat = createGlassMaterial(coloredMat);
                    return glassMat;
                  } else {
                    coloredMat.color.setHex(serviceMapping.color.replace('#', '0x'));
                    return coloredMat;
                  }
                  
                  coloredMat.needsUpdate = true;
                  return coloredMat;
                });
                child.material = coloredMaterials;
              } else {
                // Para material único
                const coloredMaterial = child.material.clone();
                
                // Aplicar textura de vidro para Guarda-Corpo
                if (serviceMapping.serviceName === 'Guarda-Corpo' && serviceMapping.textureType === 'Vidro') {
                  // Usar função de vidro realista
                  const glassMat = createGlassMaterial(coloredMaterial);
                  child.material = glassMat;
                  console.log(`🔮 Aplicando textura de vidro realista ao ${child.name}`);
                } else {
                  coloredMaterial.color.setHex(serviceMapping.color.replace('#', '0x'));
                  coloredMaterial.needsUpdate = true;
                  child.material = coloredMaterial;
                }
              }
              
              // Salvar o material colorido como original
              originalMaterials.current.set(child, child.material);
              
              console.log(`✅ Cor aplicada: ${serviceMapping.color} -> ${child.name}`);
            }
          } else {
            // Salvar material original para objetos sem cor personalizada
            originalMaterials.current.set(child, child.material);
            
            // Log das cores originais para objetos sem mapeamento
            if (child.material && child.material.color) {
              console.log(`🎨 Material original de ${child.name}:`, {
                color: child.material.color.getHexString(),
                type: child.material.type,
                hasTexture: !!child.material.map
              });
            }
          }
        }
      });
      console.log('✅ Materiais originais salvos e cores aplicadas');
      console.log('🎨 Cores aplicadas conforme especificação:');
      console.log('   🔵 Flutuante: #0066CC (Azul)');
      console.log('   🔘 Estrutura: #C0C0C0 (Cinza Metálico)');
      console.log('   ⚪ Piso: #FFFFFF (Branco - Porcelanato)');
      console.log('   🟤 Parede: #F5F5DC (Bege)');
      console.log('   🪞 Esquadrias: #E6E6FA (Prata Brilhante - Espelho)');
      console.log('   ⚫ Cobertura: #808080 (Cinza)');
      console.log('   🔄 Outros elementos mantêm cores originais do GLB');
    }
  }, [scene]);

  // Efeito para destacar elementos quando selectedElements3d muda
  useEffect(() => {
    console.log('🔄 useEffect highlightElements chamado com:', selectedElements3d);
    console.log('🔍 Tipo de selectedElements3d:', typeof selectedElements3d);
    console.log('🔍 É array?', Array.isArray(selectedElements3d));
    console.log('🔍 Tamanho:', selectedElements3d?.length);
    console.log('🔍 ModelRef existe?', !!modelRef.current);
    
    if (modelRef.current && Array.isArray(selectedElements3d) && selectedElements3d.length > 0) {
      console.log('🎯 Chamando highlightElements...');
      highlightElements(selectedElements3d);
    } else {
      console.log('🔄 Chamando restoreOriginalMaterials...');
      restoreOriginalMaterials();
    }
  }, [selectedElements3d, highlightElements, restoreOriginalMaterials]);

  // Efeito para analisar objetos do modelo (mantendo cores originais do GLB)
  useEffect(() => {
    if (!modelRef.current) return;
    
    console.log('🔍 Analisando objetos do modelo 3D...');
    let foundObjects = 0;
    
    // Manter cores e texturas originais do arquivo GLB
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const serviceMapping = getObjectCollection(child.name);
        
        if (serviceMapping) {
          foundObjects++;
          console.log(`✅ Objeto encontrado: ${child.name} -> ${serviceMapping.serviceName}`);
        } else {
          console.log(`❌ Objeto sem mapeamento: ${child.name}`);
        }
        
        // Manter cores e texturas originais do GLB - sem modificações
      }
    });
    
    console.log(`📊 Total de objetos mapeados: ${foundObjects}`);
  }, [scene]);

  // Efeito para gerenciar visibilidade dos serviços
  useEffect(() => {
    console.log('🔄 useEffect visibilidade chamado com hiddenServices:', hiddenServices);
    if (!modelRef.current) {
      console.log('❌ modelRef.current não existe no useEffect visibilidade');
      return;
    }
    
    console.log('👁️ Ocultando serviços:', hiddenServices);
    hiddenServices.forEach(serviceName => {
      toggleServiceVisibility(serviceName, true);
    });
    
    // Mostrar serviços que não estão na lista de ocultos
    const allServices = ['Flutuante', 'Estrutura', 'Piso', 'Parede', 'Esquadrias', 'Cobertura', 'Forro', 'Guarda-Corpo'];
    const visibleServices = allServices.filter(service => !hiddenServices.includes(service));
    
    console.log('👁️ Mostrando serviços:', visibleServices);
    visibleServices.forEach(serviceName => {
      toggleServiceVisibility(serviceName, false);
    });
  }, [hiddenServices, toggleServiceVisibility]);

  // Efeito para configurar o modelo quando carregado
  useEffect(() => {
    if (!modelRef.current) return;
    
    // Configurar sombras
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Configurações específicas para as disciplinas do projeto
        const serviceMapping = getObjectCollection(child.name);
        if (serviceMapping && (serviceMapping.serviceName === 'Flutuante' || serviceMapping.serviceName === 'Estrutura' || serviceMapping.serviceName === 'Piso' || serviceMapping.serviceName === 'Parede' || serviceMapping.serviceName === 'Esquadrias' || serviceMapping.serviceName === 'Cobertura')) {
          // Melhorar sombras para todas as disciplinas
          child.castShadow = true;
          child.receiveShadow = true;
          // Ajustar geometria para melhor renderização
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
          }
          
          // Configurações específicas para Flutuante
          if (serviceMapping.serviceName === 'Flutuante') {
            // Melhorar renderização de estrutura principal
            child.frustumCulled = true;
            // Otimizar para elementos estruturais
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
          
          // Configurações específicas para Esquadrias
          if (serviceMapping.serviceName === 'Esquadrias') {
            // Melhorar renderização de esquadrias
            child.frustumCulled = true;
            // Otimizar para elementos de alumínio
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
        }
      }
    });
    
    // Modelo mantém texturas originais - sem aplicação de cores por serviço
  }, [scene]);
  
  // Cleanup dos materiais quando o componente desmonta
  useEffect(() => {
    return () => {
      // Dispose dos materiais destacados
      highlightedMaterials.current.forEach((material) => {
        material.dispose();
      });
      highlightedMaterials.current.clear();
    };
  }, []);

  if (!scene) {
    console.log('❌ Scene não carregada, retornando null');
    return null;
  }
  
  console.log('✅ Scene carregada, renderizando modelo 3D');

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={1} 
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// Componente principal do visualizador 3D
export function Model3DViewer({ 
  modelPath, 
  selectedService, 
  selectedElements3d, 
  hiddenServices 
}: {
  modelPath: string;
  selectedService: ServiceMapping | null;
  selectedElements3d: string[];
  hiddenServices: string[];
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento por 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="w-full h-full relative">
      {/* Indicador de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 z-10">
          <div className="text-white text-lg font-semibold">Carregando modelo 3D...</div>
        </div>
      )}

      <Canvas
        camera={{ 
          position: [25, 12, -12], 
          fov: 55,
          near: 0.1,
          far: 2000
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: '#f8f9fa'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        color="#f8f9fa"
      >
        <MobileLighting />
        {/* Removido Environment preset que pode estar interferindo com as cores originais */}
        <color attach="background" args={['#f8f9fa']} />

        <Suspense fallback={null}>
          <Model3D 
            modelPath={modelPath} 
            selectedService={selectedService} 
            selectedElements3d={selectedElements3d}
            hiddenServices={hiddenServices}
          />
        </Suspense>

        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}           // ← Distância mínima muito próxima
          maxDistance={100}        // ← Distância máxima mais próxima
          maxPolarAngle={Math.PI / 2}  // ← **TRAVA NO TÉRREO - não vai para baixo**
          minPolarAngle={0}         // ← **LIBERDADE TOTAL PARA CIMA**
          enableDamping={true}
          dampingFactor={0.08}      // ← Movimento mais responsivo
          panSpeed={1.0}
          rotateSpeed={1.0}
          zoomSpeed={1.0}
        />
      </Canvas>
    </div>
  );
}