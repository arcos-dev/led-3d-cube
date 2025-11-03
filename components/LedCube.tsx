import React, { useRef, useEffect, memo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CUBE_SIZE, NUM_LEDS } from '../constants';
import { xyzToIndex } from '../utils/helpers';
import { Led } from '../types';

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
  const mountRef = useRef<HTMLDivElement>(null);
  const threeStuff = useRef<any>(null);

  const init = useCallback(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 25, 70);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    currentMount.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 60;

    const cubeGroup = new THREE.Group();
    const horizontalShift = 6;
    cubeGroup.position.x = horizontalShift;
    scene.add(cubeGroup);

    camera.position.set(20 + horizontalShift, 20, 20);
    controls.target.copy(cubeGroup.position);
    
    const ambientLight = new THREE.AmbientLight(0x202020);
    scene.add(ambientLight);

    const spacing = 2;
    const cubeDimensions = (CUBE_SIZE - 1) * spacing + 1;
    const boxGeometry = new THREE.BoxGeometry(cubeDimensions, cubeDimensions, cubeDimensions);
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cubeGroup.add(wireframe);

    const gridHelper = new THREE.GridHelper(16, 8, 0x4B5563, 0x222222); // Cor da base alterada aqui
    gridHelper.position.y = -8; 
    gridHelper.position.x = horizontalShift;
    scene.add(gridHelper);

    threeStuff.current = {
      scene, camera, renderer, controls, cubeGroup, wireframe, gridHelper, ledObjects: [],
      animationFrameId: null, lastTime: performance.now(), frameCount: 0
    };

    const animate = () => {
      if (!threeStuff.current) return;
      threeStuff.current.animationFrameId = requestAnimationFrame(animate);

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
        const { camera, controls, cubeGroup } = threeStuff.current;
        camera.position.set(20 + cubeGroup.position.x, 20, 20);
        controls.target.copy(cubeGroup.position);
        controls.update();
    };

    const handleZoom = (factor: number) => {
      if (!threeStuff.current) return;
      const { camera, controls } = threeStuff.current;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      offset.multiplyScalar(1 / factor);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    };

    const handlePan = (dx: number, dy: number) => {
      if (!threeStuff.current) return;
      const { camera, controls } = threeStuff.current;
      const panOffset = new THREE.Vector3();
      const vX = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const vY = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const panScale = controls.getDistance() * 0.1;

      panOffset.add(vX.multiplyScalar(-dx * panScale));
      panOffset.add(vY.multiplyScalar(dy * panScale));

      camera.position.add(panOffset);
      controls.target.add(panOffset);
      controls.update();
    };

    const panLeft = () => handlePan(1, 0);
    const panRight = () => handlePan(-1, 0);
    const panUp = () => handlePan(0, 1);
    const panDown = () => handlePan(0, -1);
    const zoomIn = () => handleZoom(1.2);
    const zoomOut = () => handleZoom(0.8);

    window.addEventListener('resize', handleResize);
    window.addEventListener('reset-camera', handleReset);
    window.addEventListener('view-control-pan-left', panLeft);
    window.addEventListener('view-control-pan-right', panRight);
    window.addEventListener('view-control-pan-up', panUp);
    window.addEventListener('view-control-pan-down', panDown);
    window.addEventListener('view-control-zoom-in', zoomIn);
    window.addEventListener('view-control-zoom-out', zoomOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('reset-camera', handleReset);
      window.removeEventListener('view-control-pan-left', panLeft);
      window.removeEventListener('view-control-pan-right', panRight);
      window.removeEventListener('view-control-pan-up', panUp);
      window.removeEventListener('view-control-pan-down', panDown);
      window.removeEventListener('view-control-zoom-in', zoomIn);
      window.removeEventListener('view-control-zoom-out', zoomOut);
      
      if(threeStuff.current?.animationFrameId) cancelAnimationFrame(threeStuff.current.animationFrameId);
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
  
  const createLeds = useCallback(() => {
    if (!threeStuff.current) return;
    const { cubeGroup, ledObjects } = threeStuff.current;
    
    if (!cubeGroup) return;
    
    if (ledObjects && ledObjects.length > 0) {
        ledObjects.forEach((obj: any) => {
            if (obj) {
                cubeGroup.remove(obj.core);
                obj.core.geometry.dispose();
                obj.core.material.dispose();
                
                cubeGroup.remove(obj.innerGlow);
                obj.innerGlow.geometry.dispose();
                obj.innerGlow.material.dispose();

                cubeGroup.remove(obj.outerGlow);
                obj.outerGlow.geometry.dispose();
                obj.outerGlow.material.dispose();

                cubeGroup.remove(obj.light);
            }
        });
    }

    const newLedObjects = new Array(NUM_LEDS);
    const coreGeometry = new THREE.SphereGeometry(0.2 * ledSize, 8, 8);
    const innerGlowGeometry = new THREE.SphereGeometry(0.35 * ledSize, 8, 8);
    const outerGlowGeometry = new THREE.SphereGeometry(0.5 * ledSize, 8, 8);

    const spacing = 2;
    const offset = (CUBE_SIZE - 1) * spacing / 2;
    
    for (let z = 0; z < CUBE_SIZE; z++) {
      for (let y = 0; y < CUBE_SIZE; y++) {
        for (let x = 0; x < CUBE_SIZE; x++) {
            const position = new THREE.Vector3(x * spacing - offset, y * spacing - offset, z * spacing - offset);
            
            const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.1 });
            const core = new THREE.Mesh(coreGeometry.clone(), coreMaterial);
            core.position.copy(position);
            cubeGroup.add(core);

            const innerGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            const innerGlow = new THREE.Mesh(innerGlowGeometry.clone(), innerGlowMaterial);
            innerGlow.position.copy(position);
            cubeGroup.add(innerGlow);

            const outerGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            const outerGlow = new THREE.Mesh(outerGlowGeometry.clone(), outerGlowMaterial);
            outerGlow.position.copy(position);
            cubeGroup.add(outerGlow);

            const light = new THREE.PointLight(0xffffff, 0, 2.5, 2);
            light.position.copy(position);
            cubeGroup.add(light);
            
            const index = xyzToIndex(x, y, z);
            newLedObjects[index] = { core, innerGlow, outerGlow, light };
        }
      }
    }
    coreGeometry.dispose();
    innerGlowGeometry.dispose();
    outerGlowGeometry.dispose();

    threeStuff.current.ledObjects = newLedObjects;
  }, [ledSize]);

  useEffect(() => {
    createLeds();
  }, [ledSize, createLeds]);

  useEffect(() => {
    if (!threeStuff.current) return;
    const { ledObjects } = threeStuff.current;
    if(!ledObjects || ledObjects.length !== NUM_LEDS) return;

    // Reduz a intensidade máxima em 25% (para 1.5x do valor base), mapeando
    // a escala de 0-200% da UI para um multiplicador efetivo de [0, 1.5].
    const effectiveBrightness = brightness * 0.75;

    for (let i = 0; i < NUM_LEDS; i++) {
        const ledData = leds[i];
        const ledObject = ledObjects[i];
          
        if(!ledObject) continue;

        if (ledData && (ledData.r > 5 || ledData.g > 5 || ledData.b > 5)) {
            const intensity = Math.max(ledData.r, ledData.g, ledData.b) / 255;
            
            const r = (ledData.r / 255);
            const g = (ledData.g / 255);
            const b = (ledData.b / 255);
            const color = new THREE.Color(r, g, b);

            const finalColor = color.clone().multiplyScalar(effectiveBrightness);
            const finalIntensity = intensity * effectiveBrightness;
            
            // Core LED
            ledObject.core.material.color.copy(finalColor);
            ledObject.core.material.opacity = 0.3 + finalIntensity * 0.7;
            
            // Inner Glow
            ledObject.innerGlow.material.color.copy(finalColor);
            ledObject.innerGlow.material.opacity = finalIntensity * 0.3;
            
            // Outer Glow
            ledObject.outerGlow.material.color.copy(finalColor);
            ledObject.outerGlow.material.opacity = finalIntensity * 0.15;

            // Point Light
            ledObject.light.color.copy(finalColor);
            ledObject.light.intensity = finalIntensity * 0.6;
        } else {
            ledObject.core.material.color.set(0x555555);
            ledObject.core.material.opacity = 0.1;
            
            ledObject.innerGlow.material.opacity = 0;
            ledObject.outerGlow.material.opacity = 0;

            ledObject.light.intensity = 0;
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
    if (threeStuff.current) {
      if (threeStuff.current.wireframe) threeStuff.current.wireframe.visible = showGrid;
      if (threeStuff.current.gridHelper) threeStuff.current.gridHelper.visible = showGrid;
    }
  }, [showGrid]);

  return <div ref={mountRef} className="w-full h-full" />;
});

export default LedCube;