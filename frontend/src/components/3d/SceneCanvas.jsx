import React, { useRef, useEffect, useState } from 'react';
import SceneFallback from './SceneFallback';
import useReducedMotion from '../../hooks/useReducedMotion';

export const SceneCanvas = ({
  renderScene,
  className = '',
  fallbackTitle = 'Interactive 3D Experience',
  interactive = true,
}) => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    if (!containerRef.current || !renderScene) return;

    let cleanup = null;
    try {
      cleanup = renderScene(containerRef.current);
      setIsReady(true);
    } catch (err) {
      console.warn('[SceneCanvas] Failed to initialize 3D scene:', err);
      setHasWebGL(false);
    }

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [renderScene, prefersReducedMotion]);

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div className={`w-full h-full min-h-[350px] relative ${className}`}>
        <SceneFallback title={fallbackTitle} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[350px] overflow-hidden ${interactive ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
    />
  );
};

export default SceneCanvas;
