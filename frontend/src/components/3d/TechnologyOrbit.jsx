import React, { useCallback, useState } from 'react';
import * as THREE from 'three';
import SceneCanvas from './SceneCanvas';
import { technologiesData } from '../../data/technologies';

export const TechnologyOrbit = () => {
  const [activeTech, setActiveTech] = useState(technologiesData[0]);

  const initOrbitScene = useCallback((container) => {
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 22);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xd4af37, 3, 50);
    goldPoint.position.set(0, 0, 0);
    scene.add(goldPoint);

    // Orbit System Container
    const orbitContainer = new THREE.Group();
    scene.add(orbitContainer);

    // Central Sun: Golden Crystal Core
    const sunGeo = new THREE.DodecahedronGeometry(2.4, 0);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x5a4317,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    orbitContainer.add(sunMesh);

    // Orbit Rings
    const ringRadii = [6.5, 9.5, 12.5];
    const rings = ringRadii.map((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r - 0.04, r + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25 - idx * 0.05,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (idx * 0.15);
      orbitContainer.add(ring);
      return ring;
    });

    // Orbiting Satellites
    const satellites = [];
    const nodeGeo = new THREE.SphereGeometry(0.7, 16, 16);

    technologiesData.forEach((tech, i) => {
      const ringIndex = i % ringRadii.length;
      const radius = ringRadii[ringIndex];
      const speed = 0.4 / (ringIndex + 1);
      const initialAngle = (i / technologiesData.length) * Math.PI * 2;

      const hexColor = parseInt(tech.color.replace('#', '0x'), 16) || 0xd4af37;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: hexColor,
        metalness: 0.7,
        roughness: 0.3,
        emissive: hexColor,
        emissiveIntensity: 0.3,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      orbitContainer.add(nodeMesh);

      satellites.push({
        mesh: nodeMesh,
        radius,
        speed,
        angle: initialAngle,
        data: tech,
      });
    });

    // Interaction Drag Controls
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
      orbitContainer.rotation.y += deltaX * 0.005;
      orbitContainer.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Raycaster for clicking tech nodes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = satellites.map((s) => s.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = satellites.find((s) => s.mesh === intersects[0].object);
        if (hit) {
          setActiveTech(hit.data);
        }
      }
    };
    container.addEventListener('click', onClick);

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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      sunMesh.rotation.y += 0.01;
      sunMesh.rotation.x += 0.005;

      satellites.forEach((sat) => {
        sat.angle += sat.speed * delta;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2) * 1.2;
      });

      if (!isDragging) {
        orbitContainer.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      nodeGeo.dispose();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* 3D Orbit Canvas */}
      <div className="lg:col-span-8 h-[450px] md:h-[520px] rounded-2xl glass-card overflow-hidden relative">
        <SceneCanvas
          renderScene={initOrbitScene}
          fallbackTitle="Interactive Technology Constellation"
          className="w-full h-full"
        />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 border border-gold-500/20 text-xs text-gold-400 font-mono">
          Click nodes or drag orbit
        </div>
      </div>

      {/* Selected Technology Inspector */}
      <div className="lg:col-span-4 glass-card p-6 rounded-2xl border-gold-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            {activeTech.category}
          </span>
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activeTech.color, boxShadow: `0 0 10px ${activeTech.color}` }}
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            {activeTech.name}
            <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
              {activeTech.level}
            </span>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {activeTech.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-2">
          <p className="text-xs text-slate-400">Production Applications at Riyadvi:</p>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>High-throughput fault-tolerant architectures</li>
            <li>Sub-second interactive client visualizers</li>
            <li>Zero-latency distributed microservices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TechnologyOrbit;
