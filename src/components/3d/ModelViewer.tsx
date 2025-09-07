import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid, 
  Environment, 
  Stats,
  useGLTF,
  PerspectiveCamera,
  ContactShadows,
  Sky
} from '@react-three/drei';
import { Group, Mesh, Box3, Vector3, Color, MeshStandardMaterial, Fog } from 'three';
import { ViewerState } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ModelProps {
  modelPath: string;
  controls: ViewerState['controls'];
  lighting: ViewerState['lighting'];
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const Model: React.FC<ModelProps> = ({ modelPath, controls, lighting, onLoad, onError }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<Group>(null);
  const { camera, scene: threeScene } = useThree();

  // Fog removido para visualização limpa

  useEffect(() => {
    if (scene) {
      // Center and scale the model
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = lighting.enableShadows;
          child.receiveShadow = lighting.enableShadows;
          
          // Materiais arquitetônicos realistas com variação de cores
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat, index) => {
                if (mat instanceof MeshStandardMaterial) {
                  mat.wireframe = controls.wireframe;
                  
                  // Cores vibrantes e modernas
                  const colors = [
                    '#FF6B6B', // Coral Red
                    '#4ECDC4', // Turquoise
                    '#45B7D1', // Sky Blue
                    '#96CEB4', // Mint Green
                    '#FFEAA7', // Soft Yellow
                    '#DDA0DD', // Plum
                    '#98D8C8', // Seafoam
                    '#F7DC6F', // Golden Yellow
                    '#BB8FCE', // Light Purple
                    '#85C1E9', // Light Blue
                    '#F8C471', // Peach
                    '#82E0AA', // Light Green
                    '#F1948A', // Light Coral
                    '#85C1E9', // Light Blue
                    '#D7BDE2'  // Light Lavender
                  ];
                  
                  const colorIndex = (index + child.geometry.attributes.position?.count || 0) % colors.length;
                  mat.color = new Color(colors[colorIndex]);
                  
                  // Propriedades vibrantes e modernas
                  mat.metalness = Math.random() * 0.3 + 0.1; // Mais metalness para brilho
                  mat.roughness = 0.3 + Math.random() * 0.4; // Menos rugosidade para mais brilho
                  mat.envMapIntensity = 1.2; // Mais reflexos
                  mat.normalScale = { x: 1.2, y: 1.2 }; // Mais textura
                  mat.emissive = new Color(colors[colorIndex]).multiplyScalar(0.1); // Emissão sutil
                  mat.emissiveIntensity = 0.3; // Intensidade da emissão
                }
              });
            } else if (child.material instanceof MeshStandardMaterial) {
              child.material.wireframe = controls.wireframe;
              
              // Cores vibrantes e modernas
              const colors = [
                '#FF6B6B', // Coral Red
                '#4ECDC4', // Turquoise
                '#45B7D1', // Sky Blue
                '#96CEB4', // Mint Green
                '#FFEAA7', // Soft Yellow
                '#DDA0DD', // Plum
                '#98D8C8', // Seafoam
                '#F7DC6F', // Golden Yellow
                '#BB8FCE', // Light Purple
                '#85C1E9', // Light Blue
                '#F8C471', // Peach
                '#82E0AA', // Light Green
                '#F1948A', // Light Coral
                '#85C1E9', // Light Blue
                '#D7BDE2'  // Light Lavender
              ];
              
              const colorIndex = (child.geometry.attributes.position?.count || 0) % colors.length;
              child.material.color = new Color(colors[colorIndex]);
              
              // Propriedades vibrantes e modernas
              child.material.metalness = Math.random() * 0.3 + 0.1; // Mais metalness para brilho
              child.material.roughness = 0.3 + Math.random() * 0.4; // Menos rugosidade para mais brilho
              child.material.envMapIntensity = 1.2; // Mais reflexos
              child.material.normalScale = { x: 1.2, y: 1.2 }; // Mais textura
              child.material.emissive = new Color(colors[colorIndex]).multiplyScalar(0.1); // Emissão sutil
              child.material.emissiveIntensity = 0.3; // Intensidade da emissão
            }
          }
        }
      });

      // Calculate bounding box and center the model
      const box = new Box3().setFromObject(scene);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1;
      
      scene.scale.setScalar(scale);
      scene.position.sub(center.multiplyScalar(scale));
      
      onLoad?.();
    }
  }, [scene, controls.wireframe, lighting.enableShadows, onLoad]);

  useFrame(() => {
    if (modelRef.current && controls.autoRotate) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
};

interface ModelViewerProps {
  modelPath: string;
  state: ViewerState;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelPath, 
  state, 
  onLoad, 
  onError 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="relative w-full h-full bg-white">
      <ErrorBoundary onError={onError}>
        <Canvas
          ref={canvasRef}
          shadows={state.lighting.enableShadows}
          gl={{ 
            antialias: window.innerWidth > 768, // Antialias apenas em desktop
            alpha: false,
            powerPreference: "high-performance",
            toneMappingExposure: 1.2,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false
          }}
          dpr={window.innerWidth > 768 ? [1, 2] : [1, 1.5]} // DPR menor no mobile
          camera={{ position: state.camera.position, fov: state.camera.fov }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Iluminação Vibrante e Colorida */}
          <ambientLight intensity={0.6} color="#ffffff" />
          
          {/* Luz principal colorida */}
          <directionalLight
            position={[10, 15, 5]}
            intensity={2.0}
            castShadow={true}
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
            color="#ffeb3b"
            shadow-bias={-0.0001}
          />
          
          {/* Luz de preenchimento azul */}
          <directionalLight
            position={[-8, 8, -8]}
            intensity={0.8}
            color="#2196f3"
          />
          
          {/* Luz lateral rosa */}
          <pointLight
            position={[0, 8, 0]}
            intensity={0.6}
            color="#e91e63"
            distance={25}
            decay={1.5}
          />
          
          {/* Luz de ambiente colorida */}
          <hemisphereLight
            intensity={0.4}
            color="#ff9800"
            groundColor="#4caf50"
          />
          
          {/* Luz adicional verde */}
          <pointLight
            position={[5, 5, 5]}
            intensity={0.4}
            color="#4caf50"
            distance={20}
            decay={2}
          />
          
          {/* Luz adicional roxa */}
          <pointLight
            position={[-5, 5, -5]}
            intensity={0.4}
            color="#9c27b0"
            distance={20}
            decay={2}
          />
          
          {/* Environment neutro */}
          <Environment preset="studio" />
          
          {/* Model */}
          <Suspense fallback={null}>
            <Model
              modelPath={modelPath}
              controls={state.controls}
              lighting={state.lighting}
              onLoad={onLoad}
              onError={onError}
            />
          </Suspense>
          
          {/* Grid removido para visualização mais limpa */}
          
          {/* Sombras de Contato Realistas */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.8}
            scale={25}
            blur={3}
            far={6}
            color="#1a1a1a"
            resolution={1024}
          />
          
          {/* Plano de Fundo Neutro */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial 
              color="#f8f9fa" 
              roughness={0.8}
              metalness={0.0}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Plano de fundo adicional neutro */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -10]} receiveShadow>
            <planeGeometry args={[40, 20]} />
            <meshStandardMaterial 
              color="#ffffff" 
              roughness={0.9}
              metalness={0.0}
              transparent
              opacity={0.1}
            />
          </mesh>
          
          {/* Controls - Otimizados para Mobile */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            minDistance={1}
            maxDistance={15}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            dampingFactor={0.05}
            enableDamping={true}
            touches={{
              ONE: 2, // Rotação com um dedo
              TWO: 1  // Zoom com dois dedos
            }}
            mouseButtons={{
              LEFT: 2, // Rotação
              MIDDLE: 1, // Zoom
              RIGHT: 0 // Pan
            }}
          />
          
          {/* Performance Stats */}
          {process.env.NODE_ENV === 'development' && <Stats />}
        </Canvas>
      </ErrorBoundary>
      
      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
      
      {/* Error Overlay */}
      {state.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="text-red-400 text-xl mb-2">⚠️ Erro ao carregar modelo</div>
            <div className="text-red-300 mb-4">{state.error}</div>
            <button
              onClick={() => onError?.('')}
              className="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
