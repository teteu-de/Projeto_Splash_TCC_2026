import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Play, Square, AlertOctagon, WifiOff, RefreshCw, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

export const Esp32LiveControls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const {
    screen,
    currentFlowLmin,
    isTapOpen,
    toggleTap,
    isSimulatingLeak,
    toggleLeakSimulation,
    isOffline,
    toggleOffline,
    addToast
  } = useApp();

  // Only show on main app screens
  if (['splash', 'onboarding', 'login', 'register'].includes(screen)) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#242424]/95 border border-zinc-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-white transition-all">
        {/* Header Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3.5 py-2 flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-800/80 transition-colors"
          id="btn-toggle-esp32-controls"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulatingLeak ? 'bg-red-400' : 'bg-[#2ba6e2]'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulatingLeak ? 'bg-red-500' : 'bg-[#2ba6e2]'}`}></span>
            </span>
            <Cpu className="w-4 h-4 text-[#2ba6e2]" />
            <span className="text-xs font-bold tracking-tight">Simulador ESP32 (Banca TCC)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-[#99d6ee] border border-zinc-700">
              {currentFlowLmin.toFixed(1)} L/min
            </span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 space-y-2 border-t border-zinc-800/80 bg-[#1a1a1a]"
            >
              <p className="text-[11px] text-zinc-400 leading-tight">
                Simule interações de vazão de água em tempo real do sensor ZJ-S201 para demonstrar a reatividade do sistema:
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Toggle Tap */}
                <button
                  onClick={toggleTap}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                    isTapOpen
                      ? 'bg-[#015486] border-[#2ba6e2] text-white shadow-md shadow-[#2ba6e2]/20'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  id="btn-sim-tap"
                >
                  {isTapOpen ? <Square className="w-4 h-4 mb-1 text-cyan-300" /> : <Play className="w-4 h-4 mb-1 text-[#2ba6e2]" />}
                  <span>{isTapOpen ? 'Zerar Fluxo' : 'Simular Fluxo'}</span>
                </button>

                {/* Toggle Leak */}
                <button
                  onClick={toggleLeakSimulation}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                    isSimulatingLeak
                      ? 'bg-red-900 border-red-500 text-white shadow-md shadow-red-500/30'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  id="btn-sim-leak"
                >
                  <AlertOctagon className="w-4 h-4 mb-1 text-red-400" />
                  <span>{isSimulatingLeak ? 'Parar Vazamento' : 'Simular Vazamento'}</span>
                </button>

                {/* Toggle Offline */}
                <button
                  onClick={toggleOffline}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                    isOffline
                      ? 'bg-amber-950 border-amber-500 text-white'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  id="btn-sim-offline"
                >
                  <WifiOff className="w-4 h-4 mb-1 text-amber-400" />
                  <span>{isOffline ? 'Reconectar Wi-Fi' : 'Queda de Wi-Fi'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                <span className="flex items-center gap-1 text-[#99d6ee]">
                  <Zap className="w-3 h-3 text-[#2ba6e2]" /> GPIO Pin: 2 (Hall Interrupt)
                </span>
                <button
                  onClick={() => addToast('info', 'Sensor Re-Calibrado', 'Fator K ajustado para 7.5 impulsos/L.')}
                  className="hover:underline text-zinc-300 flex items-center gap-0.5"
                >
                  <RefreshCw className="w-3 h-3" /> Re-calibrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
