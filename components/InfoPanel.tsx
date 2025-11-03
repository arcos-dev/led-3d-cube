import React from 'react';

const InfoPanel = () => {
    return (
        <div className="bg-[#161b22]/80 backdrop-blur-sm p-4 rounded-lg border border-[#30363d] shadow-lg max-w-sm hidden md:block">
            <h3 className="text-lg font-bold text-gray-300 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Integração Wokwi
            </h3>
            <p className="text-sm text-gray-400 mb-3">
                Para usar este visualizador no seu projeto Wokwi, adicione a chave <code>customView</code> ao seu arquivo <code>wokwi.json</code>.
            </p>
            <pre className="bg-[#010409] text-gray-300 p-3 rounded-md text-xs overflow-x-auto">
                <code>
{`{
  "version": 1,
  "customView": "URL_DESTE_APP",
  "parts": [
    { "type": "wokwi-arduino-mega", ... },
    {
      "type": "wokwi-neopixel-strip",
      "attrs": { "pixels": "512" }
    }
  ]
}`}
                </code>
            </pre>
            <p className="text-xs text-gray-500 mt-3">
                Certifique-se que o pino de dados do Arduino está conectado ao pino DIN da fita de 512 NeoPixels.
            </p>
        </div>
    );
};

export default InfoPanel;