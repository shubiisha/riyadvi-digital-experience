import React, { useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import SceneCanvas from './SceneCanvas';

/**
 * Hero 3D scene — hand-written three.js renderer with a real post-processing
 * chain (EffectComposer → RenderPass → UnrealBloom → OutputPass).
 *
 * Everything in here is a live WebGL draw call: a shader-driven energy shell,
 * instanced particle constellation, orbital rings, additive glow sprites and a
 * bloom pass that makes emissive geometry actually bleed light. Pointer input
 * drives rotation with inertia; dragging orbits the core; scrolling pulls the
 * camera. If WebGL or the composer is unavailable the caller falls back to a
 * designed static panel rather than an empty box.
 */

const ENERGY_SHELL_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vRipple;

  // Cheap 3D value noise — enough for an organic surface shimmer.
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vRipple = noise(position * 1.6 + vec3(0.0, uTime * 0.35, uTime * 0.2));
    vec3 displaced = position + normal * (vRipple - 0.5) * 0.55 * uIntensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const ENERGY_SHELL_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vRipple;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.6);
    vec3 color = mix(uColorA, uColorB, vRipple);
    float pulse = 0.78 + 0.22 * sin(uTime * 1.6 + vRipple * 6.283);
    float alpha = clamp(fresnel * 0.9 + vRipple * 0.16, 0.0, 1.0) * pulse;
    gl_FragColor = vec4(color * (0.7 + fresnel * 1.9), alpha);
  }
`;

export const DigitalEcosystem = () => {
  const initThreeScene = useCallback((container) => {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene, camera, renderer -------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Lighting -----------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyLight = new THREE.PointLight(0xd4af37, 46, 70, 2);
    keyLight.position.set(12, 12, 12);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x6ee7ff, 22, 60, 2);
    fillLight.position.set(-12, -8, 10);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xfff3c4, 18, 50, 2);
    rimLight.position.set(0, 10, -14);
    scene.add(rimLight);

    // 3. Core group ---------------------------------------------------------
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const disposables = [];
    const track = (...items) => {
      items.forEach((item) => disposables.push(item));
      return items[0];
    };

    // Dark polished core body
    const coreGeo = track(new THREE.IcosahedronGeometry(4.6, 4));
    const coreMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x120f0a,
        metalness: 0.95,
        roughness: 0.18,
        flatShading: false,
      })
    );
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Shader energy shell around the core
    const shellGeo = track(new THREE.IcosahedronGeometry(5.15, 5));
    const shellMat = track(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 1.0 },
          uColorA: { value: new THREE.Color(0xd4af37) },
          uColorB: { value: new THREE.Color(0x8be9ff) },
        },
        vertexShader: ENERGY_SHELL_VERT,
        fragmentShader: ENERGY_SHELL_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    coreGroup.add(shellMesh);

    // Gold wireframe cage
    const cageGeo = track(new THREE.IcosahedronGeometry(7.4, 1));
    const cageMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        wireframe: true,
        transparent: true,
        opacity: 0.42,
        metalness: 0.9,
        roughness: 0.1,
      })
    );
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Silhouette that only shows up through bloom
    const haloGeo = track(new THREE.SphereGeometry(6.4, 32, 32));
    const haloMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xf5e6a7,
        transparent: true,
        opacity: 0.045,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    coreGroup.add(haloMesh);

    // 4. Particle constellation --------------------------------------------
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const radii = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 9 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      radii[i] = radius;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const particlesGeo = track(new THREE.BufferGeometry());
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    particlesGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const particlesMat = track(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uColor: { value: new THREE.Color(0xf5e6a7) },
        },
        vertexShader: /* glsl */ `
          attribute float aRadius;
          attribute float aPhase;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vGlow;
          void main() {
            vec3 p = position;
            float breathe = 1.0 + sin(uTime * 0.6 + aPhase) * 0.05;
            p *= breathe;
            p.y += sin(uTime * 0.5 + aPhase) * 0.45;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (2.6 + sin(uTime * 2.0 + aPhase) * 1.4) * uPixelRatio * (26.0 / -mv.z);
            vGlow = 0.45 + 0.55 * abs(sin(uTime * 1.2 + aPhase));
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vGlow;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float alpha = smoothstep(0.5, 0.0, d) * vGlow;
            gl_FragColor = vec4(uColor * (1.1 + vGlow), alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    coreGroup.add(particleSystem);

    // 5. Orbital rings ------------------------------------------------------
    const rings = [];
    const ringSpecs = [
      { radius: 11.5, tilt: [Math.PI / 3, 0, 0], speed: 0.35, opacity: 0.55 },
      { radius: 13.4, tilt: [0, Math.PI / 4, 0.2], speed: -0.22, opacity: 0.35 },
      { radius: 15.2, tilt: [Math.PI / 2.6, 0.4, 0], speed: 0.16, opacity: 0.22 },
    ];

    ringSpecs.forEach((spec) => {
      const ringGeo = track(new THREE.TorusGeometry(spec.radius, 0.045, 12, 180));
      const ringMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xd4af37,
          transparent: true,
          opacity: spec.opacity,
          blending: THREE.AdditiveBlending,
        })
      );
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
      ring.userData.speed = spec.speed;
      rings.push(ring);
      coreGroup.add(ring);
    });

    // Orbiting nodes that ride the rings
    const nodes = ringSpecs.slice(0, 2).map((spec, index) => {
      const nodeGeo = track(new THREE.SphereGeometry(0.16, 16, 16));
      const nodeMat = track(
        new THREE.MeshBasicMaterial({ color: index === 0 ? 0xfff3c4 : 0x8be9ff })
      );
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.x = spec.radius;
      const pivot = new THREE.Group();
      pivot.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
      pivot.add(node);
      pivot.userData.speed = spec.speed * 2.2;
      coreGroup.add(pivot);
      return pivot;
    });

    // 6. Post-processing chain ---------------------------------------------
    let composer = null;
    try {
      composer = new EffectComposer(renderer);
      composer.setSize(width, height);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      composer.addPass(new RenderPass(scene, camera));

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        1.15, // strength
        0.72, // radius
        0.18 // threshold
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
    } catch (error) {
      console.warn('[DigitalEcosystem] Post-processing unavailable, rendering direct:', error);
      composer = null;
    }

    // 7. Interaction --------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const drag = { active: false, lastX: 0, lastY: 0, velocity: 0 };
    let scrollFactor = 0;

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (drag.active) {
        drag.velocity += (event.clientX - drag.lastX) * 0.0032;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
      }
    };

    const onPointerDown = (event) => {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
    };

    const onPointerUp = () => {
      drag.active = false;
    };

    const onScroll = () => {
      scrollFactor = Math.min(1, window.scrollY / 900);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) composer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation loop -----------------------------------------------------
    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let visible = true;

    // Pause the loop when scrolled out of view — keeps the page responsive.
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
            },
            { threshold: 0.01 }
          )
        : null;
    observer?.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!visible) return;

      const time = clock.getElapsedTime();
      shellMat.uniforms.uTime.value = time;
      particlesMat.uniforms.uTime.value = time;

      smoothed.x += (pointer.x - smoothed.x) * 0.045;
      smoothed.y += (pointer.y - smoothed.y) * 0.045;

      drag.velocity *= 0.94;

      coreGroup.rotation.y = time * 0.12 + smoothed.x * 0.55 + drag.velocity;
      coreGroup.rotation.x = Math.sin(time * 0.1) * 0.16 + smoothed.y * 0.35;

      coreMesh.rotation.y += 0.0035;
      cageMesh.rotation.y -= 0.0022;
      cageMesh.rotation.z += 0.0012;
      haloMesh.rotation.y += 0.0009;

      rings.forEach((ring) => {
        ring.rotation.z += ring.userData.speed * 0.004;
      });
      nodes.forEach((pivot) => {
        pivot.rotation.z += pivot.userData.speed * 0.004;
      });

      // Camera dollies back slightly and tracks the pointer.
      camera.position.z = 24 - scrollFactor * 3.2;
      camera.position.x = smoothed.x * 1.6;
      camera.position.y = -smoothed.y * 1.1;
      camera.lookAt(0, 0, 0);

      keyLight.position.x = Math.cos(time * 0.4) * 14;
      keyLight.position.z = Math.sin(time * 0.4) * 14;

      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup ------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      disposables.forEach((item) => item?.dispose?.());
      composer?.dispose?.();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
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
