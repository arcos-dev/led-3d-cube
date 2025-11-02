import React, { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Remove .jsx extension for consistency.
import LedCube from './components/LedCube';
import Controls from './components/Controls';
import Stats from './components/Stats';
import InfoPanel from './components/InfoPanel';
// FIX: Remove .js extension for consistency.
import { NUM_LEDS, PATTERN_NAMES } from './constants';
import { Led } from './types';

const App = () => {
  // FIX: Add explicit type for leds state.
  const [leds, setLeds] = useState<Led[]>(() => Array(NUM_LEDS).fill({ r: 0, g: 0, b: 0 }));
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [ledSize, setLedSize] = useState(0.8);
  const [showGrid, setShowGrid] = useState(true);
  
  const [fps, setFps] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(PATTERN_NAMES[0]);
  const [serialBuffer, setSerialBuffer] = useState('');

  useEffect(() => {
    // FIX: Add type for the event parameter.
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'neopixel-buffer' && data.buffer) {
        const buffer = new Uint8Array(data.buffer);
        // FIX: Add explicit type for newLeds array.
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
          const decoder = new TextDecoder();
          const textChunk = decoder.decode(new Uint8Array(data.bytes));
          setSerialBuffer(prev => prev + textChunk);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  useEffect(() => {
    const lines = serialBuffer.split('\n');
    if (lines.length > 1) {
      const lastCompleteLine = lines[lines.length - 2];
      const match = lastCompleteLine.match(/Mudando para padrão: (\d+)/);
      if (match && match[1]) {
        const patternIndex = parseInt(match[1], 10);
        if (patternIndex >= 0 && patternIndex < PATTERN_NAMES.length) {
          setCurrentPattern(PATTERN_NAMES[patternIndex]);
        }
      }
      setSerialBuffer(lines[lines.length - 1]);
    }
  }, [serialBuffer]);

  const activeLeds = useMemo(() => {
    return leds.filter(led => led.r > 5 || led.g > 5 || led.b > 5).length;
  }, [leds]);

  const handleResetCamera = useCallback(() => {
    window.dispatchEvent(new CustomEvent('reset-camera'));
  }, []);

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

      <InfoPanel />
    </div>
  );
};

export default App;