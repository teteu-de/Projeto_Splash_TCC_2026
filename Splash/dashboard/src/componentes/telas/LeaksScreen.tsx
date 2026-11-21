import React from 'react';
import { ArrowLeft, ShieldAlert, Clock, AlertOctagon, CheckCircle2, Play, DollarSign, Droplet, Info } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

export const LeaksScreen: React.FC = () => {
  const { setScreen, leaks, resolveLeak, ignoreLeak, isSimulatingLeak, toggleLeakSimulation } = useApp();

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            id="btn-back-leaks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-white">Detecção de Vazamentos</h2>
            <p className="text-xs text-zinc-400">Inspeção e controle anti-desperdício ESP32</p>
          </div>
        </div>

        {/* Test Simulator trigger */}
        <button
          onClick={toggleLeakSimulation}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
            isSimulatingLeak
              ? 'bg-red-950 border border-red-500 text-red-300 animate-pulse'
              : 'bg-[#015486] text-white hover:bg-[#2ba6e2]'
          }`}
          id="btn-trigger-sim-leak-screen"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{isSimulatingLeak ? 'Parar Teste' : 'Simular Teste TCC'}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/70 via-[#181818] to-zinc-900 border border-red-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-900/80 text-red-300 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Algoritmo de Fluxo Contínuo</h3>
            <p className="text-xs text-zinc-300">
              O sensor ZJ-S201 detecta micro-vazamentos monitorando pulsos constantes quando nenhum ponto de uso deveria estar ativo.
            </p>
          </div>
        </div>
      </div>

      {/* Leaks List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
          Histórico de Anomalias Detectadas
        </h3>

        {leaks.map((leak) => {
          const isActive = leak.status === 'active';
          const isResolved = leak.status === 'resolved';

          return (
            <div
              key={leak.id}
              className={`p-4 rounded-3xl border space-y-3.5 transition-all ${
                isActive
                  ? 'bg-[#242424] border-red-500/60 shadow-lg shadow-red-950/30'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? 'bg-red-500 animate-ping' : isResolved ? 'bg-emerald-500' : 'bg-zinc-500'
                    }`}
                  />
                  <h4 className="font-bold text-xs text-white">
                    {leak.locationEstimate}
                  </h4>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-red-950 text-red-300 border-red-500/40'
                      : isResolved
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {leak.status.toUpperCase()}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-4 gap-2 text-center py-1 bg-zinc-950/60 rounded-2xl p-2 border border-zinc-800/80">
                <div>
                  <span className="text-[9px] text-zinc-400">Horário</span>
                  <div className="text-xs font-bold text-white font-mono">{leak.detectedTime}</div>
                </div>

                <div>
                  <span className="text-[9px] text-zinc-400">Duração</span>
                  <div className="text-xs font-bold text-white font-mono">{leak.durationMinutes} min</div>
                </div>

                <div>
                  <span className="text-[9px] text-zinc-400">Desperdício</span>
                  <div className="text-xs font-bold text-red-400 font-mono">{leak.wastedLiters} L</div>
                </div>

                <div>
                  <span className="text-[9px] text-zinc-400">Valor Perdido</span>
                  <div className="text-xs font-bold text-amber-400 font-mono">
                    R$ {leak.wastedCost.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isActive && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => resolveLeak(leak.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    id={`btn-resolve-leak-${leak.id}`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verificar e Vedar
                  </button>

                  <button
                    onClick={() => ignoreLeak(leak.id)}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs"
                    id={`btn-ignore-leak-${leak.id}`}
                  >
                    Ignorar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
