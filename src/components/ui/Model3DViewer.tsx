import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Color, TextureLoader } from 'three';
import * as THREE from 'three';
import { LoadingSpinner } from './LoadingSpinner';
import { ServiceMapping, getObjectCollection } from '@/utils/serviceMapping';
import { getTextureConfig } from '@/utils/textureConfig';

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

// Componente do modelo 3D
function Model({ modelPath, selectedService, hiddenServices }: { 
  modelPath: string; 
  selectedService?: ServiceMapping | null;
  hiddenServices?: string[];
}) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<Group>(null);
  const { camera } = useThree();
  const [originalMaterials, setOriginalMaterials] = useState<Map<Mesh, THREE.Material>>(new Map());
  const [originalVisibility, setOriginalVisibility] = useState<Map<Mesh, boolean>>(new Map());
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

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
      
      // Ajustar posição da câmera para uma boa visualização
      const distance = maxDim * 2;
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
          
          // Criar material com propriedades PBR realistas
          const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(textureConfig.color),
            metalness: textureConfig.metalness,
            roughness: textureConfig.roughness,
            clearcoat: 0.1,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.0,
            reflectivity: 0.5,
            transparent: textureType === 'Vidro',
            opacity: textureType === 'Vidro' ? 0.3 : 1.0,
            emissive: textureConfig.emissive ? new THREE.Color(textureConfig.emissive) : new THREE.Color(0x000000),
            emissiveIntensity: textureConfig.emissiveIntensity || 0.0,
          });

          child.material = material;
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
  
  // DEBUG: Log do Model3DViewer
  console.log('🐛 DEBUG Model3DViewer component rendered');
  console.log('🐛 DEBUG modelPath:', modelPath);
  console.log('🐛 DEBUG className:', className);
  console.log('🐛 DEBUG selectedService:', selectedService);
  console.log('🐛 DEBUG hiddenServices:', hiddenServices);
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
        camera={{ position: [10, 10, 10], fov: 50 }}
        onCreated={handleLoad}
        onError={handleError}
        className="w-full h-full"
      >
        {/* Sistema de iluminação realista para destacar texturas */}
        <ambientLight intensity={0.4} color="#ffffff" />
        
        {/* Luz principal do sol */}
        <directionalLight
          position={[50, 50, 25]}
          intensity={2.5}
          color="#fff8dc"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        {/* Luz de preenchimento suave */}
        <directionalLight
          position={[-30, 30, 15]}
          intensity={0.8}
          color="#e6f3ff"
        />
        
        {/* Luz ambiente azulada para simular céu */}
        <hemisphereLight
          skyColor="#87CEEB"
          groundColor="#8B7355"
          intensity={0.6}
        />
        
        {/* Luzes pontuais para detalhes */}
        <pointLight position={[20, 20, 20]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-20, 20, 20]} intensity={1.0} color="#ffffff" />
        <pointLight position={[0, 30, 0]} intensity={0.8} color="#ffffff" />

        {/* Ambiente */}
        <Environment preset="city" />

        {/* Sombras de contato */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
          far={4.5}
        />

        {/* Modelo 3D */}
        <Suspense fallback={null}>
          <Model modelPath={modelPath} selectedService={selectedService} hiddenServices={hiddenServices} />
        </Suspense>

        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};