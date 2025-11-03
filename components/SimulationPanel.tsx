import React, { memo } from 'react';
import { PATTERN_NAMES, PALETTE_NAMES } from '../constants';

interface SimulationPanelProps {
    isSimulating: boolean;
    onToggleSimulation: () => void;
    currentPattern: string;
    onPatternSelect: (pattern: string) => void;
    colorPalette: string;
    onColorPaletteSelect: (palette: string) => void;
}

const SimulationPanel = memo(({ 
    isSimulating, onToggleSimulation, 
    currentPattern, onPatternSelect,
    colorPalette, onColorPaletteSelect
}: SimulationPanelProps) => {
    return (
        <div className="bg-[#161b22]/80 backdrop-blur-sm p-4 rounded-lg border border-[#30363d] shadow-lg w-full max-w-xs">
            <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Simulação Local
            </h2>

            <div className="mb-3">
                <label htmlFor="pattern-select" className="block text-sm font-medium text-gray-400 mb-1">Padrão Fibonacci</label>
                <select 
                    id="pattern-select"
                    value={currentPattern}
                    onChange={(e) => onPatternSelect(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-gray-500 focus:border-gray-500"
                >
                    {PATTERN_NAMES.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="palette-select" className="block text-sm font-medium text-gray-400 mb-1">Paleta de Cores</label>
                <select 
                    id="palette-select"
                    value={colorPalette}
                    onChange={(e) => onColorPaletteSelect(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-gray-500 focus:border-gray-500"
                >
                    {PALETTE_NAMES.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <button 
                onClick={onToggleSimulation} 
                className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
                    isSimulating 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                {isSimulating ? 'Parar Simulação' : 'Iniciar Simulação'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                A simulação será pausada se dados forem recebidos do Wokwi.
            </p>
        </div>
    );
});

export default SimulationPanel;