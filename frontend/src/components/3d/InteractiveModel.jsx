import React, { useCallback, useState } from 'react';
import * as THREE from 'three';
import SceneCanvas from './SceneCanvas';
import { RotateCw, Eye, Sparkles } from 'lucide-react';

export const InteractiveModel = ({ modelType = 'geometric-nodes', title = '3D Interactive Experience' }) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const initModelScene = useCallback((container) => {
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xd4af37, 3);
    goldKeyLight.position.set(10, 10, 10);
    scene.add(goldKeyLight);

    const blueFillLight = new THREE.DirectionalLight(0x60a5fa, 1.5);
    blueFillLight.position.set(-10, -5, -10);
    scene.add(blueFillLight);

    // Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let mainMesh;
    let accentMesh;

    if (modelType === 'perfume-flacon') {
      // Luxury Wanaromah Perfume Flacon
      const bottleGeo = new THREE.CylinderGeometry(2.5, 2.8, 6, 8);
      const bottleMat = new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        transmission: 0.85,
        opacity: 0.95,
        transparent: true,
        roughness: 0.05,
        ior: 1.5,
        metalness: 0.1,
      });
      mainMesh = new THREE.Mesh(bottleGeo, bottleMat);
      modelGroup.add(mainMesh);

      // Gold Cap
      const capGeo = new THREE.CylinderGeometry(1.4, 1.4, 2, 16);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.1,
      });
      accentMesh = new THREE.Mesh(capGeo, capMat);
      accentMesh.position.y = 4;
      modelGroup.add(accentMesh);
    } else if (modelType === 'planetary-orbit') {
      // Laxmi Astro AI Celestial Core
      const coreGeo = new THREE.SphereGeometry(3.5, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.2,
      });
      mainMesh = new THREE.Mesh(coreGeo, coreMat);
      modelGroup.add(mainMesh);

      const ringGeo = new THREE.TorusGeometry(6, 0.1, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xf5e6a7, metalness: 0.9 });
      accentMesh = new THREE.Mesh(ringGeo, ringMat);
      accentMesh.rotation.x = Math.PI / 2.5;
      modelGroup.add(accentMesh);
    } else {
      // Default: Polyhedral Precision Gem / Puratap
      const geo = new THREE.IcosahedronGeometry(4.8, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.15,
      });
      mainMesh = new THREE.Mesh(geo, mat);
      modelGroup.add(mainMesh);

      const wireGeo = new THREE.IcosahedronGeometry(5.2, 0);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      accentMesh = new THREE.Mesh(wireGeo, wireMat);
      modelGroup.add(accentMesh);
    }

    // Interactive Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType, autoRotate]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl glass-card overflow-hidden">
      <SceneCanvas
        renderScene={initModelScene}
        fallbackTitle={title}
        className="w-full h-full"
      />

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              autoRotate ? 'border-gold-500 bg-gold-500/20 text-gold-300' : 'border-slate-800 bg-black/60 text-slate-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            Auto-Rotate
          </button>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-black/70 border border-slate-800 text-[11px] text-slate-300 font-mono">
          Drag to inspect 360°
        </div>
      </div>
    </div>
  );
};

export default InteractiveModel;
