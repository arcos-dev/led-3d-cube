import React, { useState, memo, useCallback } from 'react';

interface CodePanelProps {
    currentPattern: string;
    codeSnippets: { [key: string]: string };
}

const CodePanel = memo(({ currentPattern, codeSnippets }: CodePanelProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const code = codeSnippets[currentPattern] || "// Nenhum código de exemplo disponível para este padrão.";

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code.trim());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }, [code]);

    return (
        <div className="bg-[#161b22]/80 backdrop-blur-sm rounded-lg border border-[#30363d] shadow-lg w-full max-w-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex justify-between items-center cursor-pointer group"
                aria-expanded={isOpen}
                aria-controls="code-panel-content"
            >
                <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Código de Exemplo (FastLED)
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div id="code-panel-content" className="p-4 pt-0 border-t border-[#30363d]">
                    <div className="relative">
                         <button 
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-1.5 bg-[#21262d] text-gray-400 hover:bg-[#30363d] hover:text-white rounded-md transition-colors"
                            aria-label={isCopied ? "Copiado!" : "Copiar código"}
                            title={isCopied ? "Copiado!" : "Copiar código"}
                         >
                            {isCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                         </button>
                        <pre className="bg-[#010409] text-gray-300 p-3 pt-4 rounded-md text-xs overflow-x-auto max-h-60 font-mono">
                            <code>
                                {code.trim()}
                            </code>
                        </pre>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Este é um exemplo simplificado para ilustrar a lógica. A implementação real pode variar.
                    </p>
                </div>
            )}
        </div>
    );
});

export default CodePanel;