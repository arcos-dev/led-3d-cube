import React from 'react';

// Fix: The 'children' prop is made optional (`children?`) to resolve a TypeScript error where the prop is not being correctly identified during compilation, even though it is always provided in usage.
const ControlButton = ({ eventName, children, 'aria-label': ariaLabel }: { eventName: string, children?: React.ReactNode, 'aria-label': string }) => (
    <button
        onClick={() => window.dispatchEvent(new CustomEvent(eventName))}
        className="w-10 h-10 bg-[#21262d]/80 backdrop-blur-sm text-gray-400 hover:bg-[#30363d] hover:text-white rounded-md transition-colors duration-200 flex items-center justify-center"
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const ViewControls = () => {
    return (
        <div className="absolute bottom-5 right-5 flex items-end gap-2">
            {/* Pan Controls */}
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[128px] h-[128px]">
                <div className="col-start-2">
                    <ControlButton eventName="view-control-pan-up" aria-label="Mover para cima">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </ControlButton>
                </div>
                <div className="col-start-1 row-start-2">
                    <ControlButton eventName="view-control-pan-left" aria-label="Mover para esquerda">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </ControlButton>
                </div>
                 <div className="col-start-2 row-start-2">
                    <ControlButton eventName="reset-camera" aria-label="Resetar visualização">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.128-5.122M20 15a9 9 0 01-14.128 5.122" /></svg>
                    </ControlButton>
                </div>
                <div className="col-start-3 row-start-2">
                    <ControlButton eventName="view-control-pan-right" aria-label="Mover para direita">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </ControlButton>
                </div>
                <div className="col-start-2 row-start-3">
                    <ControlButton eventName="view-control-pan-down" aria-label="Mover para baixo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </ControlButton>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex flex-col gap-1">
                <ControlButton eventName="view-control-zoom-in" aria-label="Aproximar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" /></svg>
                </ControlButton>
                <ControlButton eventName="view-control-zoom-out" aria-label="Afastar">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                </ControlButton>
            </div>
        </div>
    );
};

export default ViewControls;