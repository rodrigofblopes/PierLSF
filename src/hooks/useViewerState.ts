import { useState, useCallback } from 'react';
import { ViewerState, ViewerControls, CameraSettings, LightingSettings, AnimationState } from '@/types';

const initialControls: ViewerControls = {
  autoRotate: false,
  enableZoom: true,
  enablePan: true,
  enableRotate: true,
  showGrid: true,
  showAxes: true,
  wireframe: false,
};

const initialCamera: CameraSettings = {
  position: [3, 3, 3],
  fov: 65,
  near: 0.1,
  far: 1000,
};

const initialLighting: LightingSettings = {
  ambientIntensity: 0.4,
  directionalIntensity: 1.0,
  enableShadows: true,
};

const initialAnimation: AnimationState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1.0,
};

export const useViewerState = () => {
  const [state, setState] = useState<ViewerState>({
    isLoading: false,
    error: null,
    model: null,
    controls: initialControls,
    camera: initialCamera,
    lighting: initialLighting,
    animation: initialAnimation,
  });

  const updateControls = useCallback((updates: Partial<ViewerControls>) => {
    setState(prev => ({
      ...prev,
      controls: { ...prev.controls, ...updates }
    }));
  }, []);

  const updateCamera = useCallback((updates: Partial<CameraSettings>) => {
    setState(prev => ({
      ...prev,
      camera: { ...prev.camera, ...updates }
    }));
  }, []);

  const updateLighting = useCallback((updates: Partial<LightingSettings>) => {
    setState(prev => ({
      ...prev,
      lighting: { ...prev.lighting, ...updates }
    }));
  }, []);

  const updateAnimation = useCallback((updates: Partial<AnimationState>) => {
    setState(prev => ({
      ...prev,
      animation: { ...prev.animation, ...updates }
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setModel = useCallback((model: ViewerState['model']) => {
    setState(prev => ({ ...prev, model }));
  }, []);

  const resetViewer = useCallback(() => {
    setState(prev => ({
      ...prev,
      controls: initialControls,
      camera: initialCamera,
      lighting: initialLighting,
      animation: initialAnimation,
    }));
  }, []);

  return {
    state,
    updateControls,
    updateCamera,
    updateLighting,
    updateAnimation,
    setLoading,
    setError,
    setModel,
    resetViewer,
  };
};
