import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import LedCube from './components/LedCube';
import Controls from './components/Controls';
import Stats from './components/Stats';
import InfoPanel from './components/InfoPanel';
import SimulationPanel from './components/SimulationPanel';
import ViewControls from './components/ViewControls';
import CodePanel from './components/CodePanel'; // Importa o novo componente
import { NUM_LEDS, PATTERN_NAMES, PALETTE_NAMES } from './constants';
import { Led } from './types';
import { updateSimulation } from './simulation/fibonacci';
import { FASTLED_CODE } from './simulation/fastled_code'; // Importa os códigos

const App = () => {
  const [leds, setLeds] = useState<Led[]>(() => Array(NUM_LEDS).fill({ r: 0, g: 0, b: 0 }));
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [ledSize, setLedSize] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  
  const [fps, setFps] = useState(0);
  const [wokwiPattern, setWokwiPattern] = useState(PATTERN_NAMES[0]);
  const [serialBuffer, setSerialBuffer] = useState('');

  // States for local simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [localPattern, setLocalPattern] = useState(PATTERN_NAMES[0]);
  const [colorPalette, setColorPalette] = useState(PALETTE_NAMES[3]); // Default to "Aurora"
  const simulationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (!data || typeof data !== 'object') return;

      // When we receive data from Wokwi, stop local simulation
      if (isSimulating) {
        setIsSimulating(false);
      }

      if (data.type === 'neopixel-buffer' && data.buffer) {
        const buffer = new Uint8Array(data.buffer);
        const newLeds: Led[] = [];
        for (let i = 0; i < buffer.length; i += 3) {
          if (i + 2 < buffer.length) {
            newLeds.push({ r: buffer[i], g: buffer[i + 1], b: buffer[i + 2] });
          }
        }
        if (newLeds.length === NUM_LEDS) {
          setLeds(newLeds);
        }
      } else if (data.type === 'serial-data' && data.bytes) {
          const decoder = new TextDecoder('utf-8');
          const textChunk = decoder.decode(new Uint8Array(data.bytes));
          setSerialBuffer(prev => prev + textChunk);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isSimulating]);
  
  useEffect(() => {
    const lines = serialBuffer.split('\n');
    if (lines.length > 1) {
      const lastCompleteLine = lines[lines.length - 2];
      const match = lastCompleteLine.match(/Mudando para padrão: (\d+)/);
      if (match && match[1]) {
        const patternIndex = parseInt(match[1], 10);
        if (patternIndex >= 0 && patternIndex < PATTERN_NAMES.length) {
          setWokwiPattern(PATTERN_NAMES[patternIndex]);
        }
      }
      setSerialBuffer(lines[lines.length - 1]);
    }
  }, [serialBuffer]);

  // Local simulation loop
  useEffect(() => {
    const animate = (time: number) => {
        const newLeds = updateSimulation(localPattern, time, colorPalette);
        setLeds(newLeds);
        simulationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isSimulating) {
        simulationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
        if (simulationFrameRef.current) {
            cancelAnimationFrame(simulationFrameRef.current);
        }
    };
  }, [isSimulating, localPattern, colorPalette]);

  const activeLeds = useMemo(() => {
    return leds.filter(led => led.r > 5 || led.g > 5 || led.b > 5).length;
  }, [leds]);

  const handleResetCamera = useCallback(() => {
    window.dispatchEvent(new CustomEvent('reset-camera'));
  }, []);

  const handleToggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);
  
  const currentPattern = isSimulating ? localPattern : wokwiPattern;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0d1117] text-gray-300">
      <LedCube 
        leds={leds}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        brightness={brightness}
        ledSize={ledSize}
        showGrid={showGrid}
        onFpsUpdate={setFps}
      />
      
      <div className="absolute top-0 left-0 p-2 md:p-5 flex flex-col gap-4 w-full md:w-auto">
        <SimulationPanel
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          currentPattern={localPattern}
          onPatternSelect={setLocalPattern}
          colorPalette={colorPalette}
          onColorPaletteSelect={setColorPalette}
        />
        <Controls 
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotate}
          rotationSpeed={rotationSpeed}
          onRotationSpeedChange={setRotationSpeed}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          ledSize={ledSize}
          onLedSizeChange={setLedSize}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          onResetCamera={handleResetCamera}
        />
        <Stats 
          fps={fps}
          activeLeds={activeLeds}
          currentPattern={currentPattern}
        />
      </div>

      <div className="absolute top-0 right-0 p-2 md:p-5 flex flex-col gap-4 w-full md:w-auto max-w-sm">
          <CodePanel currentPattern={currentPattern} codeSnippets={FASTLED_CODE} />
          {!isSimulating && <InfoPanel />}
      </div>
      <ViewControls />
    </div>
  );
};

export default App;
