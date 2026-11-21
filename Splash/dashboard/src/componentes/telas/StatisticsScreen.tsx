import React from 'react';
import { ArrowLeft, PieChart, TrendingDown, DollarSign, Calendar, Flame, Trophy, Award, Activity } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

export const StatisticsScreen: React.FC = () => {
  const { setScreen, user } = useApp();

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="btn-back-statistics"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-white">Estatísticas do Sistema</h2>
          <p className="text-xs text-zinc-400">Indicadores consolidados de economia hídrica</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#015486] via-[#103a58] to-[#181818] border border-[#2ba6e2]/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#99d6ee]">
            Consolidado do Ano 2026
          </span>
          <PieChart className="w-5 h-5 text-[#2ba6e2]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-white/70 font-medium">Total Consumido</span>
            <div className="text-2xl font-black text-white font-mono">35.490 L</div>
          </div>
          <div>
            <span className="text-[10px] text-white/70 font-medium">Total Economizado</span>
            <div className="text-2xl font-black text-[#99d6ee] font-mono">
              {user.totalSavedLiters.toLocaleString('pt-BR')} L
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Money Saved */}
        <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">Valor Economizado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            R$ {user.totalSavedMoney.toFixed(2)}
          </div>
          <p className="text-[10px] text-zinc-400">Acumulado em 8 meses</p>
        </div>

        {/* Weekly Avg */}
        <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">Média Semanal</span>
            <Activity className="w-4 h-4 text-[#2ba6e2]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">1.036 L</div>
          <p className="text-[10px] text-emerald-400">-8% esta semana</p>
        </div>
      </div>

      {/* Consecutive Saving Days */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 to-zinc-900 border border-amber-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Dias Consecutivos Economizando</h4>
            <p className="text-xs text-amber-300 font-bold font-mono">
              {user.consecutiveSavingDays} dias ininterruptos dentro da meta!
            </p>
          </div>
        </div>
      </div>

      {/* Yearly Comparison Bar */}
      <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-3">
        <h3 className="font-bold text-xs text-white uppercase tracking-wider">
          Evolução do Consumo Anual (2024 vs 2025 vs 2026)
        </h3>

        <div className="space-y-3 pt-1">
          {[
            { year: '2024', liters: 61200, percent: 100, label: '61.200 Litros' },
            { year: '2025', liters: 54900, percent: 89, label: '54.900 Litros (-10%)' },
            { year: '2026 (Projeção)', liters: 44100, percent: 72, label: '44.100 Litros (-20%)' }
          ].map((y, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{y.year}</span>
                <span className="font-mono text-[#99d6ee] text-[11px]">{y.label}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#015486] to-[#2ba6e2] rounded-full"
                  style={{ width: `${y.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
