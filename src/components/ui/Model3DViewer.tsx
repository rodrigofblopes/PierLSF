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
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.8}
          color="#ffffff"
          castShadow={true}
        />
        <directionalLight
          position={[-30, 30, -15]}
          intensity={0.9}
          color="#ffffff"
        />
        <directionalLight
          position={[0, 40, 30]}
          intensity={0.7}
          color="#ffffff"
        />
        <hemisphereLight
          args={["#87CEEB", "#8B7355", 0.3]}
        />
      </>
    );
  }
  
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[60, 60, 30]}
        intensity={2.0}
        color="#ffffff"
        castShadow={true}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight
        position={[-40, 40, -20]}
        intensity={0.8}
        color="#ffffff"
      />
      <directionalLight
        position={[0, 50, 40]}
        intensity={0.6}
        color="#ffffff"
      />
      <hemisphereLight
        args={["#87CEEB", "#8B7355", 0.4]}
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
  
  // Cache buster estático para evitar loop infinito
  const MODEL_PATH_WITH_CACHE = `/Shopping.glb?v=shopping-3d-viewer`;
  
  // Corrigir o problema do preload - usar o mesmo caminho
  const actualModelPath = modelPath.includes('Shopping.glb') ? MODEL_PATH_WITH_CACHE : modelPath;
  useGLTF.preload(actualModelPath);
  
  const { scene } = useGLTF(actualModelPath);
  
  // Função para destacar elementos específicos
  const highlightElements = useCallback((elements: string[]) => {
    if (!modelRef.current || !Array.isArray(elements) || elements.length === 0) return;
    
    // Primeiro, restaurar todos os materiais originais
    originalMaterials.current.forEach((material, mesh) => {
      if (mesh.material !== material) {
        mesh.material = material;
      }
    });
    
    // Limpar mapas de materiais
    originalMaterials.current.clear();
    highlightedMaterials.current.clear();
    
    // Destacar elementos específicos
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const objectName = child.name.toLowerCase();
        
        // Verificar se este objeto está na lista de elementos selecionados
        const isSelected = elements.some(element => 
          objectName.includes(element.toLowerCase())
        );
        
        if (isSelected) {
          // Salvar material original se ainda não foi salvo
          if (!originalMaterials.current.has(child)) {
            originalMaterials.current.set(child, child.material);
          }
          
          // Criar e salvar material destacado
          const highlightMaterial = new THREE.MeshBasicMaterial({
            color: selectedService?.color || '#FFD700',
            transparent: true,
            opacity: 0.8,
            wireframe: false
          });
          
          highlightedMaterials.current.set(child, highlightMaterial);
          child.material = highlightMaterial;
        }
      }
    });
  }, [selectedService]);

  // Função para restaurar materiais originais
  const restoreOriginalMaterials = useCallback(() => {
    originalMaterials.current.forEach((material, mesh) => {
      if (mesh.material !== material) {
        mesh.material = material;
      }
    });
    
    // Dispose dos materiais destacados
    highlightedMaterials.current.forEach((material) => {
      material.dispose();
    });
    
    originalMaterials.current.clear();
    highlightedMaterials.current.clear();
  }, []);

  // Função para ocultar/mostrar serviços
  const toggleServiceVisibility = useCallback((serviceName: string, hidden: boolean) => {
    if (!modelRef.current) return;
    
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const serviceMapping = getObjectCollection(child.name);
        
        if (serviceMapping && serviceMapping.serviceName === serviceName) {
          child.visible = !hidden;
        }
      }
    });
  }, []);

  // Salvar materiais originais quando o modelo carrega
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          // Salvar referência do material original
          const originalMaterial = child.material;
          originalMaterials.current.set(child, originalMaterial);
        }
      });
    }
  }, [scene]);

  // Efeito para destacar elementos quando selectedElements3d muda
  useEffect(() => {
    if (modelRef.current && Array.isArray(selectedElements3d) && selectedElements3d.length > 0) {
      highlightElements(selectedElements3d);
    } else {
      restoreOriginalMaterials();
    }
  }, [selectedElements3d, highlightElements, restoreOriginalMaterials]);

  // Efeito para aplicar texturas específicas apenas em Eletrica e Hidrosanitario
  useEffect(() => {
    if (!modelRef.current) return;
    
    // Aplicar cores específicas apenas em Eletrica e Hidrosanitario
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const serviceMapping = getObjectCollection(child.name);
        
        if (serviceMapping && (serviceMapping.serviceName === 'Eletrica' || serviceMapping.serviceName === 'Hidrosanitario' || serviceMapping.serviceName === 'Dutos' || serviceMapping.serviceName === 'Gas' || serviceMapping.serviceName === 'PPCIP')) {
          // Aplicar cor específica para Eletrica, Hidrosanitario e Dutos
          if (child.material instanceof THREE.MeshStandardMaterial) {
            const colorHex = parseInt(serviceMapping.color.replace('#', ''), 16);
            child.material.color.setHex(colorHex);
            
            // Melhorar propriedades do material para Hidrosanitario
            if (serviceMapping.serviceName === 'Hidrosanitario') {
              child.material.metalness = 0.1; // Baixo metalness para PVC
              child.material.roughness = 0.3; // Superfície lisa
              child.material.emissive.setHex(0x001100); // Leve brilho verde
              child.material.emissiveIntensity = 0.1;
            }
            
            // Melhorar propriedades do material para Eletrica
            if (serviceMapping.serviceName === 'Eletrica') {
              child.material.metalness = 0.8; // Alto metalness para metais
              child.material.roughness = 0.2; // Superfície metálica
            }
            
            // Melhorar propriedades do material para Dutos
            if (serviceMapping.serviceName === 'Dutos') {
              child.material.metalness = 0.7; // Alto metalness para dutos metálicos
              child.material.roughness = 0.15; // Superfície metálica lisa
              child.material.emissive.setHex(0x001040); // Leve brilho azul
              child.material.emissiveIntensity = 0.05;
              // Adicionar reflexão para dutos metálicos
              child.material.envMapIntensity = 0.8;
            }
            
            // Melhorar propriedades do material para Gas GLP (vermelho intenso)
            if (serviceMapping.serviceName === 'Gas') {
              child.material.metalness = 0.9; // Alto metalness para tubulações de gás
              child.material.roughness = 0.1; // Superfície metálica muito lisa
              child.material.emissive.setHex(0x8B0000); // Brilho vermelho escuro GLP
              child.material.emissiveIntensity = 0.1;
              // Adicionar reflexão intensa para gás
              child.material.envMapIntensity = 1.0;
              // Adicionar transparência sutil para efeito de brilho
              child.material.transparent = false;
              child.material.opacity = 1.0;
            }
            
            // Melhorar propriedades do material para PPCIP (vermelho intenso)
            if (serviceMapping.serviceName === 'PPCIP') {
              child.material.metalness = 0.9; // Alto metalness para equipamentos PPCIP
              child.material.roughness = 0.1; // Superfície metálica muito lisa
              child.material.emissive.setHex(0x660000); // Brilho vermelho muito escuro PPCIP
              child.material.emissiveIntensity = 0.1;
              // Adicionar reflexão intensa para PPCIP
              child.material.envMapIntensity = 1.0;
              // Adicionar transparência sutil para efeito de brilho
              child.material.transparent = false;
              child.material.opacity = 1.0;
            }
          }
        }
      }
    });
  }, [scene]);

  // Efeito para gerenciar visibilidade dos serviços
  useEffect(() => {
    if (!modelRef.current) return;
    
    hiddenServices.forEach(serviceName => {
      toggleServiceVisibility(serviceName, true);
    });
    
    // Mostrar serviços que não estão na lista de ocultos
    const allServices = ['Arquitetura', 'Eletrica', 'Hidrosanitario', 'Dutos', 'Incendio', 'Gas', 'PPCIP'];
    const visibleServices = allServices.filter(service => !hiddenServices.includes(service));
    
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
        
        // Configurações específicas para dutos, gás e PPCIP
        const serviceMapping = getObjectCollection(child.name);
        if (serviceMapping && (serviceMapping.serviceName === 'Dutos' || serviceMapping.serviceName === 'Gas' || serviceMapping.serviceName === 'PPCIP')) {
          // Melhorar sombras para dutos e gás
          child.castShadow = true;
          child.receiveShadow = true;
          // Ajustar geometria para melhor renderização
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
          }
          
          // Configurações específicas para gás
          if (serviceMapping.serviceName === 'Gas') {
            // Melhorar renderização de tubulações de gás
            child.frustumCulled = true;
            // Otimizar para elementos cilíndricos
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
          
          // Configurações específicas para PPCIP
          if (serviceMapping.serviceName === 'PPCIP') {
            // Melhorar renderização de equipamentos PPCIP
            child.frustumCulled = true;
            // Otimizar para elementos de segurança
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
    return null;
  }

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
          position: [120, 30, -60], 
          fov: 45,
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
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        color="#f8f9fa"
      >
        <MobileLighting />
        <Environment preset="studio" />
        <color attach="background" args={['#f8f9fa']} />

        <Suspense fallback={null}>
          <Model3D 
            modelPath={modelPath} 
            selectedService={selectedService} 
            selectedElements3d={selectedElements3d}
            hiddenServices={hiddenServices}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={400}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          autoRotateSpeed={0.3}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.08}
          panSpeed={0.8}
          rotateSpeed={0.6}
          zoomSpeed={1.2}
          screenSpacePanning={false}
          keys={{
            LEFT: 'ArrowLeft',
            UP: 'ArrowUp', 
            RIGHT: 'ArrowRight',
            BOTTOM: 'ArrowDown'
          }}
        />
      </Canvas>
    </div>
  );
}