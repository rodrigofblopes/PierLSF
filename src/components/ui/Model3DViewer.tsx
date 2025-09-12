import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Color, TextureLoader } from 'three';
import * as THREE from 'three';
import { LoadingSpinner } from './LoadingSpinner';
import { ServiceMapping, getObjectCollection } from '@/utils/serviceMapping';
import { getTextureConfig } from '@/utils/textureConfig';

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

// Componente de iluminação adaptativo
function MobileLighting() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Iluminação simplificada para mobile
    return (
      <>
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          color="#ffffff"
        />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#888888"
          intensity={0.4}
        />
      </>
    );
  }
  
  // Iluminação completa para desktop
  return (
    <>
      <ambientLight intensity={0.3} color="#f0f8ff" />
      
      <directionalLight
        position={[40, 60, 30]}
        intensity={3.0}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      
      <directionalLight
        position={[-25, 35, 20]}
        intensity={1.2}
        color="#e8f4fd"
      />
      
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#a0896b"
        intensity={0.8}
      />
      
      <pointLight 
        position={[30, 25, 25]} 
        intensity={2.0} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[-25, 25, 25]} 
        intensity={1.5} 
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[0, 40, 0]} 
        intensity={1.0} 
        color="#f0f8ff"
      />
      
      <directionalLight
        position={[-20, -10, -30]}
        intensity={0.5}
        color="#ffeaa7"
      />

      <Environment 
        preset="city" 
        background={false}
        environmentIntensity={2.0}
        resolution={512}
      />
    </>
  );
}

// Error Boundary para capturar erros do modelo 3D
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 Error Boundary capturou erro:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Detalhes do erro 3D:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </group>
      );
    }

    return this.props.children;
  }
}

interface Model3DViewerProps {
  modelPath: string;
  className?: string;
  selectedService?: ServiceMapping | null;
  hiddenServices?: string[];
}

// Interface para dados do CSV
interface CSVData {
  item: string;
  unid: string;
  qtd: string;
  elementos3d: string;
  textura: string;
}

// Preload do modelo 3D
useGLTF.preload('./ARQ.glb');

// Componente do modelo 3D
function Model({ modelPath, selectedService, hiddenServices }: { 
  modelPath: string; 
  selectedService?: ServiceMapping | null;
  hiddenServices?: string[];
}) {
  const { scene } = useGLTF(modelPath);
  
  // Log do carregamento
  React.useEffect(() => {
    if (scene) {
      console.log('✅ Modelo GLTF carregado com sucesso:', modelPath);
      console.log('📊 Objetos no scene:', scene.children.length);
    }
  }, [scene, modelPath]);
  const modelRef = useRef<Group>(null);
  const { camera } = useThree();
  const [originalMaterials, setOriginalMaterials] = useState<Map<Mesh, THREE.Material>>(new Map());
  const [originalVisibility, setOriginalVisibility] = useState<Map<Mesh, boolean>>(new Map());
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Função para aplicar texturas procedurais simples
  const applyProceduralTexture = (material: THREE.MeshPhysicalMaterial, textureType: string, mesh: THREE.Mesh) => {
    // Criar textura procedural baseada no tipo
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Gerar padrão baseado no tipo de material
      switch(textureType) {
        case 'Concreto':
          // Textura de concreto com ruído
          ctx.fillStyle = '#A9A9A9';
          ctx.fillRect(0, 0, 512, 512);
          for(let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, 0.3)`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
          }
          break;
        case 'Tijolo':
          // Padrão de tijolos
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(0, 0, 512, 512);
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 2;
          for(let y = 0; y < 512; y += 64) {
            for(let x = 0; x < 512; x += 128) {
              ctx.strokeRect(x + (y % 128 === 0 ? 0 : 64), y, 128, 64);
            }
          }
          break;
        case 'Madeira':
          // Padrão de madeira
          ctx.fillStyle = '#A0522D';
          ctx.fillRect(0, 0, 512, 512);
          for(let i = 0; i < 20; i++) {
            ctx.strokeStyle = `rgba(101, 67, 33, ${Math.random() * 0.5 + 0.3})`;
            ctx.lineWidth = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * 512);
            ctx.lineTo(512, Math.random() * 512);
            ctx.stroke();
          }
          break;
      }
      
      // Aplicar textura ao material
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      material.map = texture;
      material.needsUpdate = true;
    }
  };

  // Carregar dados do CSV
  const loadCSVData = async () => {
    try {
      const response = await fetch('./Link.csv');
      if (!response.ok) {
        throw new Error('Arquivo CSV não encontrado');
      }
      
      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      
      const csvData: CSVData[] = lines
        .slice(1) // Pular cabeçalho
        .filter(line => line.trim())
        .map(line => {
          const [item, unid, qtd, elementos3d, textura] = line.split(';');
          return {
            item: item?.trim() || '',
            unid: unid?.trim() || '',
            qtd: qtd?.trim() || '',
            elementos3d: elementos3d?.trim() || '',
            textura: textura?.trim() || ''
          };
        });
      
      setCsvData(csvData);
      console.log('📊 CSV carregado:', csvData.length, 'itens');
    } catch (error) {
      console.error('❌ Erro ao carregar CSV:', error);
    }
  };

  // Carregar CSV na inicialização
  useEffect(() => {
    loadCSVData();
  }, []);

  // Função para encontrar a textura de um objeto baseado no CSV
  const findTextureForObject = (objectName: string): string => {
    for (const item of csvData) {
      if (item.elementos3d && item.elementos3d.includes(objectName)) {
        return item.textura || 'Default';
      }
    }
    return 'Default';
  };

  // Auto-ajustar posição da câmera baseada no modelo
  React.useEffect(() => {
    if (modelRef.current && scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Centralizar o modelo
      modelRef.current.position.copy(center.multiplyScalar(-1));
      
      // Ajustar posição da câmera para uma visualização mais próxima
      const distance = maxDim * 1.2;
      camera.position.set(distance, distance * 0.7, distance);
      camera.lookAt(center);
    }
  }, [scene, camera]);

  // Aplicar texturas baseadas no CSV e salvar materiais originais
  React.useEffect(() => {
    if (modelRef.current && csvData.length > 0) {
      const materialsMap = new Map<Mesh, THREE.Material>();
      let appliedTextures = 0;
      
      console.log('🎨 Iniciando aplicação de texturas baseadas no CSV...');
      
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          // Salvar material original
          materialsMap.set(child, child.material);
          
          // Encontrar textura baseada no CSV
          const textureType = findTextureForObject(child.name);
          const textureConfig = getTextureConfig(textureType);
          
          console.log(`🎨 Objeto: ${child.name}`);
          console.log(`🎨 Textura encontrada: ${textureType}`);
          console.log(`🎨 Configuração:`, textureConfig);
          
          // Detectar dispositivo móvel
          const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                                window.innerWidth < 768;

          // Material adaptativo baseado no dispositivo
          const material = isMobileDevice 
            ? new THREE.MeshStandardMaterial({
                // Material simplificado para mobile
                color: new THREE.Color(textureConfig.color),
                metalness: textureConfig.metalness * 0.7, // Reduzir metalness
                roughness: Math.max(textureConfig.roughness, 0.3), // Aumentar roughness mínimo
                envMapIntensity: 0.5, // Reduzir reflexões
                side: THREE.FrontSide,
                flatShading: false,
                fog: true,
              })
            : new THREE.MeshPhysicalMaterial({
                // Material completo para desktop
                color: new THREE.Color(textureConfig.color),
                metalness: textureConfig.metalness,
                roughness: textureConfig.roughness,
                
                // Clearcoat baseado no tipo de material
                clearcoat: (() => {
                  switch(textureType) {
                    case 'Pintura': case 'Porcelanato': case 'Cerâmica': return 0.8;
                    case 'Madeira': return 0.3;
                    case 'Metal': case 'Alumínio': case 'Aço': return 0.1;
                    default: return 0.0;
                  }
                })(),
                clearcoatRoughness: textureType === 'Pintura' ? 0.05 : 0.15,
                
                // Environment mapping otimizado
                envMapIntensity: textureConfig.metalness > 0.5 ? 3.0 : 
                               textureType === 'Vidro' ? 2.5 : 1.5,
                reflectivity: textureConfig.metalness > 0.5 ? 0.95 : 
                             textureType === 'Vidro' ? 0.9 : 0.5,
                
                // Sistema de transparência avançado
                transparent: textureType.includes('Vidro'),
                opacity: textureType === 'Vidro' ? 0.15 : 
                        textureType === 'Vidro_Transparente' ? 0.05 : 1.0,
                transmission: textureType.includes('Vidro') ? 0.95 : 0,
                thickness: textureType.includes('Vidro') ? 0.1 : 0,
                ior: textureType.includes('Vidro') ? 1.52 : 1.0,
                
                // Sheen para materiais orgânicos
                sheen: textureType === 'Madeira' ? 0.5 : 
                      textureType === 'Cerâmica' ? 0.2 : 0,
                sheenRoughness: textureType === 'Madeira' ? 0.8 : 0.9,
                sheenColor: textureType === 'Madeira' ? 
                           new THREE.Color(textureConfig.color).multiplyScalar(0.7) : 
                           new THREE.Color(0x000000),
                
                // Iridescence para metais especiais
                iridescence: textureType === 'Aço' ? 0.3 : 
                            textureType === 'Cobre' ? 0.4 : 0,
                iridescenceIOR: 1.3,
                iridescenceThicknessRange: [100, 400],
                
                // Sistema de emissão
                emissive: textureConfig.emissive ? new THREE.Color(textureConfig.emissive) : new THREE.Color(0x000000),
                emissiveIntensity: textureConfig.emissiveIntensity || 0.0,
                
                // Configurações de qualidade máxima
                side: THREE.FrontSide,
                flatShading: false,
                wireframe: false,
                vertexColors: false,
                fog: true,
                alphaTest: 0.01,
                
                // Sombras e normais
                castShadow: true,
                receiveShadow: true,
                normalScale: new THREE.Vector2(1.0, 1.0),
              });

          // Aplicar filtro anisótrópico apenas no desktop
          if (!isMobileDevice && child.material && child.material.map) {
            const renderer = document.querySelector('canvas')?.getContext('webgl2') || 
                           document.querySelector('canvas')?.getContext('webgl');
            if (renderer) {
              const maxAnisotropy = renderer.getParameter(renderer.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
              child.material.map.anisotropy = Math.min(16, maxAnisotropy);
            }
          }

          // Aplicar textura procedural apenas no desktop para economizar recursos
          if (!isMobileDevice) {
            applyProceduralTexture(material, textureType, child);
          }
          
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
          appliedTextures++;
        }
      });
      
      setOriginalMaterials(materialsMap);
      setTexturesLoaded(true);
      console.log(`✅ Aplicadas ${appliedTextures} texturas baseadas no CSV`);
    }
  }, [scene, csvData]);

  // Destacar elementos baseados na Scene Collection selecionada
  React.useEffect(() => {
    if (modelRef.current && selectedService) {
      console.log('🎯 Serviço selecionado:', selectedService.serviceName);
      console.log('🔍 Keywords:', selectedService.keywords);
      
      let foundObjects = 0;
      let totalObjects = 0;
      
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          totalObjects++;
          const objectName = child.name.toLowerCase();
          
          // Log dos primeiros 5 objetos para debug
          if (totalObjects <= 5) {
            console.log(`🔍 Objeto ${totalObjects}: "${child.name}"`);
          }
          
          // Verificar se o objeto pertence à Scene Collection selecionada
          const objectCollection = getObjectCollection(child.name);
          const belongsToCollection = objectCollection && objectCollection.serviceName === selectedService.serviceName;
          
          if (belongsToCollection && totalObjects <= 5) {
            console.log(`🎯 Match encontrado: "${child.name}" pertence à coleção "${selectedService.blenderCollectionName}"`);
          }
          
          if (belongsToCollection) {
            foundObjects++;
            console.log('✅ Objeto encontrado:', child.name);
            // Destacar em laranja
            const highlightMaterial = new MeshPhysicalMaterial({
              color: new THREE.Color(0xFF8C00), // Laranja
              metalness: 0.2,
              roughness: 0.4,
              clearcoat: 0.3,
              clearcoatRoughness: 0.2,
              envMapIntensity: 1.5,
              reflectivity: 0.8,
              emissive: new THREE.Color(0xFF4500),
              emissiveIntensity: 0.1,
            });
            
            child.material = highlightMaterial;
          } else {
            // Restaurar material original
            const originalMaterial = originalMaterials.get(child);
            if (originalMaterial) {
              child.material = originalMaterial;
            }
          }
        }
      });
      
      console.log(`📊 Resultado: ${foundObjects} objetos encontrados de ${totalObjects} total`);
    } else if (modelRef.current && !selectedService) {
      console.log('🔄 Restaurando materiais originais');
      // Restaurar todos os materiais originais quando nenhum serviço está selecionado
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          const originalMaterial = originalMaterials.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
          }
        }
      });
    }
  }, [selectedService, originalMaterials]);

  // Ocultar/mostrar elementos baseados nos hiddenServices
  React.useEffect(() => {
    if (modelRef.current && hiddenServices) {
      console.log('👁️ Serviços ocultos:', hiddenServices);
      
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          // Verificar se o objeto pertence a algum serviço oculto
          const objectCollection = getObjectCollection(child.name);
          const belongsToHiddenService = objectCollection && hiddenServices.includes(objectCollection.serviceName);
          
          if (belongsToHiddenService) {
            child.visible = false;
            console.log('🙈 Ocultando objeto:', child.name, 'da coleção:', objectCollection.blenderCollectionName);
          } else {
            child.visible = true;
          }
        }
      });
    }
  }, [hiddenServices]);

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

// Componente principal do visualizador
export const Model3DViewer: React.FC<Model3DViewerProps> = ({ modelPath, className = '', selectedService, hiddenServices }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Erro ao carregar o modelo 3D');
  };

  return (
    <div className={`relative w-full bg-white overflow-hidden ${className}`}>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-white font-medium">Carregando modelo 3D...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <p className="text-white font-medium text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-gray-100"
            >
              Recarregar
            </button>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        onCreated={(state) => {
          try {
            // Configurações básicas de renderização
            state.gl.outputColorSpace = 'srgb';
            state.gl.toneMapping = THREE.ACESFilmicToneMapping;
            state.gl.toneMappingExposure = 0.8;
            
            // Detectar dispositivo móvel
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth < 768;
            
            console.log('📱 Dispositivo móvel detectado:', isMobile);
            console.log('🔍 User Agent:', navigator.userAgent);
            console.log('📐 Largura da tela:', window.innerWidth);
            
            // Configurações otimizadas para mobile
            if (isMobile) {
              // Configurações de performance para mobile
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              state.gl.shadowMap.enabled = false; // Desabilitar sombras em mobile
              state.gl.antialias = false; // Desabilitar anti-aliasing em mobile
              state.gl.toneMappingExposure = 0.7; // Exposição menor para mobile
              console.log('⚡ Configurações de mobile aplicadas');
            } else {
              // Configurações de alta qualidade para desktop
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              state.gl.shadowMap.enabled = true;
              state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
              state.gl.shadowMap.autoUpdate = true;
              state.gl.antialias = true;
              
              // Extensões avançadas apenas no desktop
              const gl = state.gl.getContext();
              const extensions = gl.getSupportedExtensions();
              
              if (extensions?.includes('EXT_texture_filter_anisotropic')) {
                const ext = gl.getExtension('EXT_texture_filter_anisotropic');
                state.gl.capabilities.maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
              }
              
              if (extensions?.includes('OES_texture_float')) {
                gl.getExtension('OES_texture_float');
              }
              
              // Lighting configuração atualizada para Three.js r155+
              state.gl.useLegacyLights = false;
              console.log('🖥️ Configurações de desktop aplicadas');
            }
            
            handleLoad();
          } catch (error) {
            console.error('❌ Erro na inicialização do 3D:', error);
            handleError();
          }
        }}
        onError={(error) => {
          console.error('❌ Erro no Canvas:', error);
          handleError();
        }}
        className="w-full h-full"
        shadows={!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth >= 768}
        dpr={[0.5, 2]}
        performance={{ min: 0.3, max: 1.0 }}
        gl={{ 
          alpha: false,
          antialias: false,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
          powerPreference: "default",
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        }}
        onContextLost={(event) => {
          console.warn('⚠️ WebGL Context Lost:', event);
          event.preventDefault();
        }}
        onContextRestored={() => {
          console.log('🔄 WebGL Context Restored');
        }}
      >
        {/* Sistema de iluminação adaptativo para mobile/desktop */}
        <MobileLighting />

        {/* Contact Shadows removidas para eliminar grid */}

        {/* Modelo 3D com Error Boundary */}
        <Suspense fallback={null}>
          <ErrorBoundary>
            <Model modelPath={modelPath} selectedService={selectedService} hiddenServices={hiddenServices} />
          </ErrorBoundary>
        </Suspense>

        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};