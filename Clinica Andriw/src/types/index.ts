export interface ModelInfo {
  name: string;
  path: string;
  size?: number;
  format: 'glb' | 'gltf' | 'fbx' | 'obj';
  description?: string;
}

export interface ViewerControls {
  autoRotate: boolean;
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  showGrid: boolean;
  showAxes: boolean;
  wireframe: boolean;
}

export interface CameraSettings {
  position: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface LightingSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  enableShadows: boolean;
}

export interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
}

export interface ViewerState {
  isLoading: boolean;
  error: string | null;
  model: ModelInfo | null;
  controls: ViewerControls;
  camera: CameraSettings;
  lighting: LightingSettings;
  animation: AnimationState;
}
