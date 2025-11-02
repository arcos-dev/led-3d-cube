import React, { memo, ReactNode } from 'react';

// FIX: Define prop types for ControlInput component.
interface ControlInputProps {
    label: string;
    value: string | number;
    children: ReactNode;
}

const ControlInput = ({ label, value, children }: ControlInputProps) => (
    <div className="mb-3">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label} <span className="text-blue-400 font-mono">{value}</span></label>
        {children}
    </div>
);

// FIX: Define prop types for Controls component.
interface ControlsProps {
  autoRotate: boolean;
  onAutoRotateChange: (value: boolean) => void;
  rotationSpeed: number;
  onRotationSpeedChange: (value: number) => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  ledSize: number;
  onLedSizeChange: (value: number) => void;
  showGrid: boolean;
  onShowGridChange: (value: boolean) => void;
  onResetCamera: () => void;
}

const Controls = memo(({
  autoRotate, onAutoRotateChange,
  rotationSpeed, onRotationSpeedChange,
  brightness, onBrightnessChange,
  ledSize, onLedSizeChange,
  showGrid, onShowGridChange,
  onResetCamera,
}: ControlsProps) => {
  return (
    <div className="bg-[#161b22]/80 backdrop-blur-sm p-4 rounded-lg border border-[#30363d] shadow-lg w-full max-w-xs">
        <h2 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Controles da Visualização
        </h2>

        <div className="flex items-center justify-between mb-3">
             <label htmlFor="autoRotate" className="text-sm font-medium text-gray-400">Rotação Automática</label>
             <input type="checkbox" id="autoRotate" checked={autoRotate} onChange={(e) => onAutoRotateChange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600 focus:ring-blue-500" />
        </div>
        
        <ControlInput label="Velocidade" value={`${rotationSpeed.toFixed(1)}x`}>
            <input type="range" min="0" max="10" step="0.1" value={rotationSpeed} onChange={e => onRotationSpeedChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </ControlInput>

        <ControlInput label="Brilho LEDs" value={`${Math.round(brightness * 100)}%`}>
            <input type="range" min="0" max="2" step="0.05" value={brightness} onChange={e => onBrightnessChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </ControlInput>

        <ControlInput label="Tamanho LEDs" value={ledSize.toFixed(1)}>
            <input type="range" min="0.3" max="1.5" step="0.1" value={ledSize} onChange={e => onLedSizeChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </ControlInput>

        <div className="flex items-center justify-between mb-4">
             <label htmlFor="showGrid" className="text-sm font-medium text-gray-400">Mostrar Grid</label>
             <input type="checkbox" id="showGrid" checked={showGrid} onChange={(e) => onShowGridChange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600 focus:ring-blue-500" />
        </div>

        <button onClick={onResetCamera} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            Resetar Câmera
        </button>
    </div>
  );
});

export default Controls;