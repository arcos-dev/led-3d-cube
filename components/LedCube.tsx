import React, { useRef, useEffect, memo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// FIX: Remove .js extension for consistency.
import { CUBE_SIZE, NUM_LEDS } from '../constants';
import { xyzToIndex } from '../utils/helpers';
import { Led } from '../types';

// FIX: Define prop types for the LedCube component.
interface LedCubeProps {
  leds: Led[];
  autoRotate: boolean;
  rotationSpeed: number;
  brightness: number;
  ledSize: number;
  showGrid: boolean;
  onFpsUpdate: (fps: number) => void;
}

const LedCube = memo(({ leds, autoRotate, rotationSpeed, brightness, ledSize, showGrid, onFpsUpdate }: LedCubeProps) => {
  // FIX: Add explicit type for the ref.
  const mountRef = useRef<HTMLDivElement>(null);
  // FIX: Use `any` for complex, undeclared three.js object structure.
  const threeStuff = useRef<any>(null);

  const init = useCallback(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.Fog(0x0d1117, 40, 100);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(20, 20, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 60;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(15, 25, 15);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(CUBE_SIZE * 2, CUBE_SIZE * 2, 0x30363d, 0x1a1f26);
    gridHelper.position.y = -CUBE_SIZE;
    scene.add(gridHelper);

    threeStuff.current = {
      scene, camera, renderer, controls, ledMeshes: [], gridHelper, 
      animationFrameId: null, lastTime: performance.now(), frameCount: 0
    };

    const animate = () => {
      if (!threeStuff.current) return;

      const { controls, renderer, scene, camera, lastTime, frameCount } = threeStuff.current;
      
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        onFpsUpdate(frameCount);
        threeStuff.current.frameCount = 0;
        threeStuff.current.lastTime = currentTime;
      }
      threeStuff.current.frameCount++;

      controls.update();
      renderer.render(scene, camera);
      threeStuff.current.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    
    const handleResize = () => {
      if (!threeStuff.current || !mountRef.current) return;
      const { renderer, camera } = threeStuff.current;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    
    const handleReset = () => {
        if (!threeStuff.current) return;
        const { camera, controls } = threeStuff.current;
        camera.position.set(20, 20, 20);
        controls.target.set(0, 0, 0);
        controls.update();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('reset-camera', handleReset);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('reset-camera', handleReset);
      if(threeStuff.current?.animationFrameId) cancelAnimationFrame(threeStuff.current.animationFrameId);
      // FIX: Use mountRef.current in cleanup function scope.
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onFpsUpdate]);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);
  
  const createOrUpdateLeds = useCallback(() => {
    if (!threeStuff.current) return;
    const { scene, ledMeshes } = threeStuff.current;

    ledMeshes.forEach((mesh: THREE.Mesh) => scene.remove(mesh));
    ledMeshes.length = 0;

    const geometry = new THREE.SphereGeometry(LED_RADIUS * ledSize, 12, 12);
    
    for (let i = 0; i < NUM_LEDS; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            emissive: 0x000000,
            metalness: 0.2,
            roughness: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        // We'll set position later when updating colors to map correctly
        scene.add(mesh);
        ledMeshes.push(mesh);
    }
    threeStuff.current.ledMeshes = ledMeshes;
  }, [ledSize]);

  useEffect(() => {
    createOrUpdateLeds();
  }, [ledSize, createOrUpdateLeds]);

  useEffect(() => {
    if (!threeStuff.current) return;
    const { ledMeshes } = threeStuff.current;
    if(ledMeshes.length !== NUM_LEDS) return;

    const spacing = 2;
    const offset = (CUBE_SIZE - 1) * spacing / 2;
    let meshIndex = 0;

    for (let z = 0; z < CUBE_SIZE; z++) {
      for (let y = 0; y < CUBE_SIZE; y++) {
        for (let x = 0; x < CUBE_SIZE; x++) {
          const index = xyzToIndex(x, y, z);
          const ledData = leds[index];
          const mesh = ledMeshes[meshIndex++];
          
          if(!mesh) continue;

          mesh.position.set(x * spacing - offset, y * spacing - offset, z * spacing - offset);
          
          if (ledData) {
            const color = new THREE.Color(ledData.r / 255, ledData.g / 255, ledData.b / 255);
            // FIX: Ensure mesh.material is of a type that has emissive and color properties.
            const material = mesh.material as THREE.MeshStandardMaterial;
            material.emissive.copy(color);
            material.color.copy(color);
            const intensity = Math.max(ledData.r, ledData.g, ledData.b) / 255;
            material.emissiveIntensity = intensity * brightness * 2;
          }
        }
      }
    }
  }, [leds, brightness]);

  useEffect(() => {
    if (threeStuff.current) {
      threeStuff.current.controls.autoRotate = autoRotate;
      threeStuff.current.controls.autoRotateSpeed = rotationSpeed;
    }
  }, [autoRotate, rotationSpeed]);

  useEffect(() => {
    if (threeStuff.current?.gridHelper) {
      threeStuff.current.gridHelper.visible = showGrid;
    }
  }, [showGrid]);

  const LED_RADIUS = 0.35;

  return <div ref={mountRef} className="w-full h-full" />;
});

export default LedCube;