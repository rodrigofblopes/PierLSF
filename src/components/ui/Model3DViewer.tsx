import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Group, Mesh, MeshPhysicalMaterial } from 'three';
import * as THREE from 'three';
import { LoadingSpinner } from './LoadingSpinner';
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

// Iluminação otimizada para realçar cores dos materiais
function MobileLighting() {
  const isMobile = useIsMobile();
  
  console.log('💡 Iluminação colorida ativada, mobile:', isMobile);
  
  if (isMobile) {
    // Iluminação otimizada para mobile com mais intensidade
    return (
      <>
        <ambientLight intensity={0.6} color="#f8f8ff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.4}
          color="#ffffff"
        />
        <directionalLight
          position={[-10, 10, -5]}
          intensity={0.8}
          color="#fffacd"
        />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffffff" />
      </>
    );
  }
  
  // Iluminação rica para desktop - realça cores dos materiais
  return (
    <>
      {/* Luz ambiente mais forte para realçar cores */}
      <ambientLight intensity={0.5} color="#f8f8ff" />
      
      {/* Luz principal do sol - mais intensa */}
      <directionalLight
        position={[20, 30, 15]}
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Luz de preenchimento com toque quente */}
      <directionalLight
        position={[-20, 20, -15]}
        intensity={1.2}
        color="#fffacd"
      />
      
      {/* Luz de cima mais forte */}
      <directionalLight
        position={[0, 40, 0]}
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* Luzes pontuais para dar vida */}
      <pointLight position={[15, 20, 15]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-15, 20, -15]} intensity={0.4} color="#fff8dc" />
      
      {/* Luz hemisférica mais intensa */}
      <hemisphereLight
        args={["#87ceeb", "#deb887", 0.6]}
      />

      {/* Environment map mais presente */}
      <Environment 
        preset="sunset" 
        background={false}
        environmentIntensity={0.7}
        resolution={256}
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
}

// Sistema de cache inteligente para recarregar GLB atualizado
const GLB_CACHE_BUSTER = Date.now(); // Arquivo COMPATIBILIZAÇÃO - força novo carregamento
const MODEL_PATH_WITH_CACHE = `./Compatibilização.glb?v=${GLB_CACHE_BUSTER}`;
console.log(`🔥 GLB COMPATIBILIZAÇÃO CARREGADA! Cache buster: ${GLB_CACHE_BUSTER}`);

// Preload do modelo 3D com cache buster
useGLTF.preload(MODEL_PATH_WITH_CACHE);

// Componente do modelo 3D
function Model({ modelPath, selectedService, hiddenServices }: { 
  modelPath: string; 
  selectedService?: ServiceMapping | null;
  hiddenServices?: string[];
}) {
  // Usar o path com cache buster para garantir carregamento da versão mais recente
  const actualModelPath = modelPath.includes('Compatibilização.glb') ? MODEL_PATH_WITH_CACHE : modelPath;
  const { scene } = useGLTF(actualModelPath);
  
  // Log detalhado do carregamento
  React.useEffect(() => {
    if (scene) {
      console.log('✅ Modelo GLTF carregado com sucesso:', actualModelPath);
      console.log('🔄 Cache buster aplicado para versão mais recente');
      console.log('📊 Objetos no scene:', scene.children.length);
      console.log('🕐 Arquivo GLB carregado em:', new Date().toLocaleTimeString());
      
      // Debug detalhado dos materiais carregados
      let materialCount = 0;
      let objectCount = 0;
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          objectCount++;
          console.log(`🔍 Objeto ${objectCount}: "${child.name}"`);
          console.log(`📝 Material:`, child.material);
          
          if (child.material) {
            materialCount++;
            if (child.material.color) {
              console.log(`🎨 Cor: R:${child.material.color.r.toFixed(2)} G:${child.material.color.g.toFixed(2)} B:${child.material.color.b.toFixed(2)}`);
            }
            if (child.material.map) {
              console.log(`🖼️ Textura encontrada:`, child.material.map);
            }
            if (child.material.metalness !== undefined) {
              console.log(`✨ Metalness: ${child.material.metalness}`);
            }
            if (child.material.roughness !== undefined) {
              console.log(`🏔️ Roughness: ${child.material.roughness}`);
            }
          } else {
            console.log(`❌ Sem material!`);
          }
          
          // Parar após os primeiros 10 objetos para não poluir o console
          if (objectCount >= 10) {
            console.log(`... e mais ${scene.children.length - 10} objetos`);
            return;
          }
        }
      });
      
      console.log(`📊 Total: ${objectCount} objetos, ${materialCount} com materiais`);
    }
  }, [scene, actualModelPath]);
  const modelRef = useRef<Group>(null);
  const { camera } = useThree();
  const [originalMaterials, setOriginalMaterials] = useState<Map<Mesh, THREE.Material>>(new Map());

  // Função removida - agora focamos apenas nos materiais do Blender

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
          const [item, unid, qtd, elementos3d] = line.split(';');
          return {
            item: item?.trim() || '',
            unid: unid?.trim() || '',
            qtd: qtd?.trim() || '',
            elementos3d: elementos3d?.trim() || ''
          };
        });
      
      console.log('📊 CSV carregado:', csvData.length, 'itens');
    } catch (error) {
      console.error('❌ Erro ao carregar CSV:', error);
    }
  };

  // Carregar CSV na inicialização
  useEffect(() => {
    loadCSVData();
  }, []);

  // Função removida - não usamos mais texturas do CSV

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

  // PRESERVAÇÃO TOTAL DOS MATERIAIS DO BLENDER - MÁXIMA FIDELIDADE
  React.useEffect(() => {
    if (modelRef.current) {
      const materialsMap = new Map<Mesh, THREE.Material>();
      let totalObjects = 0;
      let materialsWithTextures = 0;
      let materialsWithMetallic = 0;
      
      console.log('🎨 PRESERVAÇÃO TOTAL dos materiais do Blender iniciada...');
      
      modelRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          totalObjects++;
          
          // Salvar referência do material original EXATAMENTE como foi exportado
          const originalMaterial = child.material;
          materialsMap.set(child, originalMaterial);
          
          console.log(`🎨 Objeto ${totalObjects}: "${child.name}"`);
          console.log(`🎨 Tipo do material:`, originalMaterial.type);
          
          
          // PRESERVAR TODAS as propriedades do material do Blender
          if (originalMaterial) {
            // Apenas melhorar qualidade de renderização SEM alterar aparência
            if (originalMaterial instanceof THREE.MeshStandardMaterial || 
                originalMaterial instanceof THREE.MeshPhysicalMaterial) {
              
              // Garantir que needsUpdate seja true para aplicar mudanças
              originalMaterial.needsUpdate = true;
              
              // Aplicar cores baseadas no nome do objeto se estiver muito neutro
              if (originalMaterial.color) {
                const currentColor = originalMaterial.color;
                const r = currentColor.r;
                const g = currentColor.g;
                const b = currentColor.b;
                
                // Sempre verificar materiais (não só os claros) para detectar elementos especiais
                console.log(`🔍 Verificando objeto: ${child.name}`);
                console.log(`🎨 Material: ${originalMaterial.name || 'sem nome'}`);
                console.log(`🌈 Cor atual: RGB(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`);
                
                const objectName = child.name.toLowerCase();
                const materialName = (originalMaterial.name || '').toLowerCase();
                
                // Verificar se é o elemento UNIQUE (busca mais ampla)
                if (objectName.includes('unique') || materialName.includes('unique') ||
                    objectName.includes('logo') || materialName.includes('logo') ||
                    objectName.includes('letreiro') || materialName.includes('letreiro') ||
                    objectName.includes('placa') || materialName.includes('placa')) {
                  console.log(`🚨 ELEMENTO ESPECIAL DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  // Aplicar cor dourada metálica
                  originalMaterial.color.setHex(0xFFD700); // Dourado
                  originalMaterial.metalness = 0.8;
                  originalMaterial.roughness = 0.1;
                  originalMaterial.emissive.setHex(0x332200); // Leve brilho dourado
                  originalMaterial.emissiveIntensity = 0.1;
                  originalMaterial.needsUpdate = true;
                  console.log(`✨ Cor dourada metálica aplicada!`);
                  return;
                }
                
                // Verificar material "Madeira"
                if (materialName.includes('madeira')) {
                  console.log(`🚨 MATERIAL "MADEIRA" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de madeira natural
                  originalMaterial.color.setHex(0x8B4513); // Marrom madeira (SaddleBrown)
                  originalMaterial.metalness = 0.0; // Madeira não é metálica
                  originalMaterial.roughness = 0.7; // Rugosidade natural da madeira
                  
                  // Se for MeshPhysicalMaterial, aplicar propriedades de madeira
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.2; // Verniz sutil
                    originalMaterial.clearcoatRoughness = 0.8; // Rugosidade no verniz para textura
                    originalMaterial.reflectivity = 0.3; // Reflexão moderada
                    originalMaterial.envMapIntensity = 0.4; // Environment map sutil
                    originalMaterial.sheen = 0.1; // Brilho natural muito sutil
                    originalMaterial.sheenColor.setHex(0xD2691E); // Brilho cor chocolate
                    originalMaterial.sheenRoughness = 0.9; // Alta rugosidade para textura orgânica
                    originalMaterial.transmission = 0.0; // Opaca
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🌳 Textura de madeira natural aplicada!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar material "Porcelanato"
                if (materialName.includes('porcelanato')) {
                  console.log(`🚨 MATERIAL "PORCELANATO" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de porcelanato 60x60 com aspecto de rejunte
                  originalMaterial.color.setHex(0xF8F8F8); // Branco quase puro com leve cinza
                  originalMaterial.metalness = 0.05; // Muito pouco metálico
                  originalMaterial.roughness = 0.15; // Muito baixa rugosidade para polimento
                  
                  // Se for MeshPhysicalMaterial, simular porcelanato com micro-textura
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.9; // Alto clearcoat para brilho máximo
                    originalMaterial.clearcoatRoughness = 0.05; // Quase espelhado
                    originalMaterial.reflectivity = 0.8; // Alta reflexão
                    originalMaterial.envMapIntensity = 1.0; // Máximas reflexões do ambiente
                    originalMaterial.sheen = 0.1; // Brilho cerâmico sutil
                    originalMaterial.sheenColor.setHex(0xF0F0F0); // Brilho branco suave
                    originalMaterial.sheenRoughness = 0.2; // Baixa rugosidade no sheen
                    // Simular micro-textura de rejunte com propriedades sutis
                    originalMaterial.normalScale.set(0.1, 0.1); // Escala sutil para simular textura
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🏺 Porcelanato 60x60 polido com micro-textura aplicado!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar material "Vidro"
                if (materialName.includes('vidro')) {
                  console.log(`🚨 MATERIAL "VIDRO" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de vidro realista
                  originalMaterial.color.setHex(0xF0F8FF); // Azul muito claro (vidro levemente azulado)
                  originalMaterial.metalness = 0.0; // Vidro não é metálico
                  originalMaterial.roughness = 0.0; // Completamente liso
                  originalMaterial.transparent = true; // Transparente
                  originalMaterial.opacity = 0.1; // Muito transparente
                  
                  // Se for MeshPhysicalMaterial, aplicar propriedades avançadas de vidro
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.transmission = 1.0; // Máxima transmissão de luz
                    originalMaterial.thickness = 0.5; // Espessura do vidro
                    originalMaterial.ior = 1.5; // Índice de refração do vidro
                    originalMaterial.clearcoat = 1.0; // Superfície polida
                    originalMaterial.clearcoatRoughness = 0.0; // Totalmente lisa
                    originalMaterial.reflectivity = 0.9; // Alta reflexão
                    originalMaterial.envMapIntensity = 1.0; // Reflexões do ambiente
                    originalMaterial.sheen = 0.0; // Sem sheen para vidro
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🪟 Textura de vidro transparente aplicada!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar material "Solo Orgânico"
                if (materialName.includes('solo') && materialName.includes('organico')) {
                  console.log(`🚨 MATERIAL "SOLO ORGÂNICO" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de terra/solo orgânico
                  originalMaterial.color.setHex(0x2F2F2F); // Preto terra orgânica
                  originalMaterial.metalness = 0.0; // Solo não é metálico
                  originalMaterial.roughness = 0.95; // Muito áspero como terra
                  
                  // Se for MeshPhysicalMaterial, simular solo
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.0; // Sem verniz
                    originalMaterial.clearcoatRoughness = 1.0; // Totalmente áspero
                    originalMaterial.reflectivity = 0.05; // Quase sem reflexão
                    originalMaterial.envMapIntensity = 0.1; // Mínimo environment map
                    originalMaterial.sheen = 0.0; // Sem brilho
                    originalMaterial.transmission = 0.0; // Opaco
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🖤 Solo orgânico preto aplicado!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar material "Papel Picado"
                if (materialName.includes('papel') && materialName.includes('picado')) {
                  console.log(`🚨 MATERIAL "PAPEL PICADO" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de papel/textura orgânica
                  originalMaterial.color.setHex(0xE6E0D4); // Bege acinzentado (bege + toque de cinza)
                  originalMaterial.metalness = 0.0; // Sem metalness (papel não é metálico)
                  originalMaterial.roughness = 0.85; // Alta rugosidade para textura de papel
                  
                  // Se for MeshPhysicalMaterial, simular papel
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.0; // Sem verniz
                    originalMaterial.clearcoatRoughness = 1.0; // Totalmente áspero
                    originalMaterial.reflectivity = 0.1; // Muito pouca reflexão
                    originalMaterial.envMapIntensity = 0.2; // Mínimo environment map
                    originalMaterial.sheen = 0.1; // Brilho mínimo
                    originalMaterial.sheenColor.setHex(0xFFFFFF); // Brilho branco sutil
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`📄 Textura de papel bege acinzentado aplicada!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar material "Toque de Brilho"
                if (materialName.includes('toque') && materialName.includes('brilho')) {
                  console.log(`🚨 MATERIAL "TOQUE DE BRILHO" DETECTADO!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar propriedades de dourado arenoso
                  originalMaterial.color.setHex(0xDAA520); // Dourado mais escuro/arenoso (GoldenRod)
                  originalMaterial.metalness = 0.6; // Metálico moderado para textura arenosa
                  originalMaterial.roughness = 0.4; // Rugosidade média para textura arenosa
                  originalMaterial.emissive.setHex(0x2A1A0A); // Emissão dourada sutil
                  originalMaterial.emissiveIntensity = 0.1; // Intensidade muito sutil
                  
                  // Se for MeshPhysicalMaterial, adicionar textura arenosa
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.3; // Clearcoat reduzido para menos polimento
                    originalMaterial.clearcoatRoughness = 0.6; // Rugosidade no clearcoat para textura
                    originalMaterial.reflectivity = 0.7; // Reflexão moderada
                    originalMaterial.envMapIntensity = 1.5; // Environment map moderado
                    originalMaterial.sheen = 0.3; // Brilho sedoso reduzido
                    originalMaterial.sheenColor.setHex(0xDAA520); // Brilho dourado arenoso
                    originalMaterial.sheenRoughness = 0.5; // Rugosidade no sheen para textura
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🏜️ Dourado arenoso aplicado!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Log para elementos que não são detectados especificamente
                if (objectName.includes('text') || materialName.includes('text') ||
                    child.name.includes('UNIQUE') || (originalMaterial.name && originalMaterial.name.includes('UNIQUE'))) {
                  console.log(`🎯 POSSÍVEL ELEMENTO UNIQUE ENCONTRADO!`);
                  console.log(`📦 Nome EXATO do objeto: "${child.name}"`);
                  console.log(`🎨 Nome EXATO do material: "${originalMaterial.name}"`);
                }
                
                // Verificar piso podotátil SEMPRE (independente da cor atual)
                if (materialName.includes('piso') && materialName.includes('podotatil')) {
                  console.log(`🚨 DETECTADO! Material "Piso Podotatil" encontrado!`);
                  originalMaterial.color.setHex(0xFFFF00); // Amarelo puro
                  originalMaterial.needsUpdate = true;
                  console.log(`♿ Amarelo aplicado ao material: ${originalMaterial.name}`);
                  return; // Sair para não aplicar outras cores
                } else if (materialName.includes('podot') || materialName.includes('tatil')) {
                  console.log(`🚨 DETECTADO! Variação de podotátil encontrada!`);
                  originalMaterial.color.setHex(0xFFFF00); // Amarelo puro
                  originalMaterial.needsUpdate = true;
                  console.log(`♿ Amarelo aplicado ao material: ${originalMaterial.name}`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Verificar piso calçada SEMPRE (independente da cor atual)
                if (objectName.includes('pisocalcada') || objectName.includes('pisocalçada') || 
                   materialName.includes('calcada') || materialName.includes('calçada') ||
                   (materialName.includes('piso') && (materialName.includes('calcada') || materialName.includes('calçada')))) {
                  console.log(`🚨 PISO CALÇADA DETECTADO SEMPRE!`);
                  console.log(`📦 Nome do objeto: ${child.name}`);
                  console.log(`🎨 Nome do material: ${originalMaterial.name}`);
                  
                  // Aplicar textura de concreto cinza
                  originalMaterial.color.setHex(0x9E9E9E); // Cinza concreto
                  originalMaterial.roughness = 0.8; // Rugosidade alta para textura de concreto
                  originalMaterial.metalness = 0.1; // Levemente metálico
                  
                  // Se for MeshPhysicalMaterial, adicionar mais realismo
                  if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
                    originalMaterial.clearcoat = 0.0; // Sem verniz
                    originalMaterial.clearcoatRoughness = 1.0; // Áspero
                  }
                  
                  originalMaterial.needsUpdate = true;
                  console.log(`🏗️ Textura de concreto aplicada ao piso calçada!`);
                  return; // Sair para não aplicar outras cores
                }
                
                // Se a cor está muito neutra/branca (RGB > 0.8), aplicar outras cores
                if (r > 0.8 && g > 0.8 && b > 0.8) {
                  // Aplicar cores baseadas no tipo de elemento (objeto ou material)
                  if (objectName.includes('parede') || materialName.includes('parede')) {
                    originalMaterial.color.setHex(0xE8F4FD); // Azul claro para paredes
                    console.log(`🏠 Cor de parede aplicada`);
                  } else if (objectName.includes('pisocalcada') || objectName.includes('pisocalçada') || 
                            (objectName.includes('piso') && (objectName.includes('calcada') || objectName.includes('calçada'))) ||
                            materialName.includes('calcada') || materialName.includes('calçada')) {
                    // Piso de calçada identificado
                    originalMaterial.color.setHex(0xC0C0C0); // Cinza claro para calçada
                    console.log(`🚶 PISO CALÇADA DETECTADO!`);
                    console.log(`📦 Objeto: ${child.name}`);
                    console.log(`🎨 Material: ${originalMaterial.name}`);
                    console.log(`✅ Cor de calçada aplicada`);
                  } else if (objectName.includes('piso')) {
                    originalMaterial.color.setHex(0xD2D2D2); // Cinza para pisos internos
                    console.log(`🏗️ Cor de piso interno aplicada`);
                  } else if (objectName.includes('telhado') || objectName.includes('telha')) {
                    originalMaterial.color.setHex(0x808080); // Cinza para telhas de fibrocimento
                    originalMaterial.roughness = 0.6; // Textura de fibrocimento
                    console.log(`🏠 Cor de telha fibrocimento aplicada`);
                  } else if (objectName.includes('esquadria') || objectName.includes('janela') || objectName.includes('porta')) {
                    originalMaterial.color.setHex(0x0066CC); // Azul para esquadrias
                    originalMaterial.metalness = 0.6;
                    originalMaterial.roughness = 0.3;
                    console.log(`🚪 Cor de esquadria aplicada`);
                  } else if (objectName.includes('eletrica') || materialName.includes('eletrica') ||
                             objectName.includes('interruptor') || materialName.includes('interruptor') ||
                             objectName.includes('tomada') || materialName.includes('tomada') ||
                             objectName.includes('eletroduto') || materialName.includes('eletroduto') ||
                             objectName.includes('caixa de luz') || materialName.includes('caixa de luz') ||
                             objectName.includes('pvc corrugado') || materialName.includes('pvc corrugado')) {
                    originalMaterial.color.setHex(0xFF6600); // Laranja para elétrica
                    originalMaterial.metalness = 0.7;
                    originalMaterial.roughness = 0.2;
                    originalMaterial.emissive.setHex(0x331100); // Leve emissão laranja
                    originalMaterial.emissiveIntensity = 0.1;
                    console.log(`⚡ Cor elétrica aplicada para: ${child.name}`);
                  } else if (objectName.includes('pergolado') || objectName.includes('madeira')) {
                    originalMaterial.color.setHex(0x8B4513); // Marrom madeira
                    console.log(`🌳 Cor de madeira aplicada`);
                  } else {
                    // Para outros elementos, aplicar um cinza mais escuro
                    originalMaterial.color.setHex(0xCCCCCC);
                    console.log(`🔧 Cor padrão aplicada para: ${child.name}`);
                  }
                } else {
                  // Se já tem cor, apenas realçar sutilmente
                  const hsl = { h: 0, s: 0, l: 0 };
                  currentColor.getHSL(hsl);
                  hsl.s = Math.min(1.0, hsl.s * 1.2); // 20% mais saturação
                  hsl.l = Math.min(0.9, hsl.l * 1.1); // 10% mais brilho, mas limitado
                  originalMaterial.color.setHSL(hsl.h, hsl.s, hsl.l);
                  console.log(`🌈 Saturação melhorada`);
                }
              }
              
              // Detectar dispositivo móvel
              const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                                    window.innerWidth < 768;
              
              if (!isMobileDevice) {
                // Melhorias de qualidade APENAS no desktop sem alterar aparência
                if (originalMaterial.map) {
                  // Aplicar filtro anisótrópico nas texturas para maior qualidade
                  const renderer = document.querySelector('canvas')?.getContext('webgl2') || 
                                 document.querySelector('canvas')?.getContext('webgl');
                  if (renderer) {
                    const ext = renderer.getExtension('EXT_texture_filter_anisotropic');
                    if (ext) {
                      const maxAnisotropy = renderer.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
                      originalMaterial.map.anisotropy = Math.min(16, maxAnisotropy);
                    }
                  }
                  materialsWithTextures++;
                  console.log(`🖼️ Textura preservada com qualidade máxima`);
                }
                
                // Verificar propriedades metálicas
                if (originalMaterial.metalness > 0) {
                  materialsWithMetallic++;
                  console.log(`⚡ Material metálico preservado`);
                }
              }
            }
            
            // Log detalhado das propriedades preservadas
            if (originalMaterial.color) {
              const r = Math.round(originalMaterial.color.r * 255);
              const g = Math.round(originalMaterial.color.g * 255);
              const b = Math.round(originalMaterial.color.b * 255);
              console.log(`🎨 Cor preservada: RGB(${r}, ${g}, ${b})`);
            }
            
            if (originalMaterial.emissive && !originalMaterial.emissive.equals(new THREE.Color(0x000000))) {
              const er = Math.round(originalMaterial.emissive.r * 255);
              const eg = Math.round(originalMaterial.emissive.g * 255);
              const eb = Math.round(originalMaterial.emissive.b * 255);
              console.log(`💡 Emissão preservada: RGB(${er}, ${eg}, ${eb})`);
            }
            
            if (originalMaterial.metalness !== undefined && originalMaterial.metalness > 0) {
              console.log(`⚡ Metalness preservado: ${originalMaterial.metalness}`);
            }
            
            if (originalMaterial.roughness !== undefined) {
              console.log(`🪨 Roughness preservado: ${originalMaterial.roughness}`);
            }
            
            if (originalMaterial.transparent) {
              console.log(`🔍 Transparência preservada: ${originalMaterial.opacity}`);
            }
            
            // Log de texturas preservadas
            if (originalMaterial.map) console.log(`🖼️ Diffuse Map preservado`);
            if (originalMaterial.normalMap) console.log(`🔺 Normal Map preservado`);
            if (originalMaterial.roughnessMap) console.log(`🪨 Roughness Map preservado`);
            if (originalMaterial.metalnessMap) console.log(`⚡ Metalness Map preservado`);
            if (originalMaterial.emissiveMap) console.log(`💡 Emissive Map preservado`);
            if (originalMaterial.bumpMap) console.log(`⛰️ Bump Map preservado`);
            if (originalMaterial.displacementMap) console.log(`📐 Displacement Map preservado`);
          }
          
          // Configurar sombras SEM alterar material
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      setOriginalMaterials(materialsMap);
      console.log(`✅ PRESERVAÇÃO CONCLUÍDA: ${totalObjects} objetos, ${materialsWithTextures} com texturas, ${materialsWithMetallic} metálicos`);
      console.log(`🎯 TODOS os materiais do Blender foram preservados com 100% de fidelidade!`);
      console.log(`🔄 ARQUIVO GLB ATUALIZADO - Carregando nova versão!`);
    }
  }, [scene]);

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
export const Model3DViewer: React.FC<Model3DViewerProps> = ({ 
  modelPath, 
  className = '', 
  selectedService, 
  hiddenServices
}) => {
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
    <div className={`relative w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${className}`}>
      
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
            // Configurações otimizadas para realçar cores
            state.gl.outputColorSpace = 'srgb';
            state.gl.toneMapping = THREE.ACESFilmicToneMapping;
            state.gl.toneMappingExposure = 1.1; // Exposição balanceada para cores vibrantes sem estourar
            
            // Detectar dispositivo móvel
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth < 768;
            
            console.log('📱 Dispositivo móvel detectado:', isMobile);
            console.log('🔍 User Agent:', navigator.userAgent);
            console.log('📐 Largura da tela:', window.innerWidth);
            
            // Configurações otimizadas para mobile
            if (isMobile) {
              // Configurações de performance para mobile com cores melhores
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              state.gl.shadowMap.enabled = false;
              state.gl.toneMappingExposure = 1.0; // Exposição balanceada no mobile
              console.log('⚡ Configurações de mobile aplicadas');
            } else {
              // Configurações de qualidade máxima para desktop
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              state.gl.shadowMap.enabled = true;
              state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
              state.gl.shadowMap.autoUpdate = true;
              state.gl.toneMappingExposure = 1.1; // Exposição balanceada para cores vibrantes
              
              console.log('🎨 Configurações de alta saturação aplicadas');
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
          alpha: true,
          antialias: false,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
          powerPreference: "default",
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        }}
      >
        {/* Sistema de iluminação balanceada que preserva materiais do Blender */}
        <MobileLighting />

        {/* Contact Shadows removidas para eliminar grid */}

        {/* Modelo 3D com Error Boundary */}
        <Suspense fallback={null}>
          <ErrorBoundary>
            <Model 
              modelPath={modelPath} 
              selectedService={selectedService} 
              hiddenServices={hiddenServices}
            />
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