import React from 'react';
// FIX: Remove .js extension for consistency.
import { NUM_LEDS } from '../constants';

// FIX: Define prop types for the Stats component.
interface StatsProps {
    fps: number;
    activeLeds: number;
    currentPattern: string;
}

const Stats = ({ fps, activeLeds, currentPattern }: StatsProps) => {
    return (
        <div className="bg-[#161b22]/80 backdrop-blur-sm p-4 rounded-lg border border-[#30363d] shadow-lg w-full max-w-xs font-mono text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-400">FPS:</span>
                <span className="text-green-400 font-bold">{fps}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
                <span className="text-gray-400">LEDs Ativos:</span>
                <span className="text-green-400 font-bold">{activeLeds} / {NUM_LEDS}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#30363d]">
                <span className="text-gray-400 block">Padrão Atual:</span>
                <span className="text-purple-400 font-bold text-base block truncate">{currentPattern}</span>
            </div>
        </div>
    );
};

export default Stats;