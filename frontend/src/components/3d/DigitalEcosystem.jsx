import React, { useCallback } from 'react';
import * as THREE from 'three';
import SceneCanvas from './SceneCanvas';

export const DigitalEcosystem = () => {
  const initThreeScene = useCallback((container) => {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightGold = new THREE.PointLight(0xd4af37, 3.5, 60);
    pointLightGold.position.set(12, 12, 12);
    scene.add(pointLightGold);

    const pointLightWarm = new THREE.PointLight(0xf5e6a7, 2, 40);
    pointLightWarm.position.set(-10, -10, 10);
    scene.add(pointLightWarm);

    // 3. Central Core Group: Geometric Connected Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer wireframe icosahedron (Gold)
    const outerGeo = new THREE.IcosahedronGeometry(7.2, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      metalness: 0.9,
      roughness: 0.1,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Inner glowing solid metallic octahedron
    const innerGeo = new THREE.OctahedronGeometry(4.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xb89228,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Inner wireframe sphere for cyber core
    const sphereGeo = new THREE.SphereGeometry(2.5, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphereMesh);

    // 4. Particle Constellation Network
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 9 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0xf5e6a7,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    coreGroup.add(particleSystem);

    // 5. Orbital Golden Rings
    const ringGeo = new THREE.TorusGeometry(12, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.scale.set(1.15, 1.15, 1.15);
    coreGroup.add(ring2);

    // 6. Interactive Mouse Coordinates with Lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = (x / rect.width - 0.5) * 1.8;
      targetY = (y / rect.height - 0.5) * 1.8;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      coreGroup.rotation.y = elapsedTime * 0.15 + mouseX;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2 + mouseY;

      outerMesh.rotation.y -= 0.005;
      innerMesh.rotation.x += 0.008;
      innerMesh.rotation.z += 0.005;

      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup Function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[560px]">
      <SceneCanvas
        renderScene={initThreeScene}
        fallbackTitle="Interactive Digital Ecosystem"
        className="w-full h-full"
      />
    </div>
  );
};

export default DigitalEcosystem;
