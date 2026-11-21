import React, { useState } from 'react';
import { ArrowLeft, Target, Trophy, CheckCircle2, Award, Sparkles, TrendingDown } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

export const SavingsGoalScreen: React.FC = () => {
  const { setScreen, savingsGoal, updateGoal, settings } = useApp();

  const [targetLiters, setTargetLiters] = useState(savingsGoal.targetLitersMonthly.toString());
  const [isEditing, setIsEditing] = useState(false);

  const currentLiters = savingsGoal.currentLitersMonthly;
  const targetNum = savingsGoal.targetLitersMonthly;
  const percent = Math.min(100, Math.round((currentLiters / targetNum) * 100));

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const litersNum = parseInt(targetLiters, 10);
    if (!isNaN(litersNum) && litersNum > 1000) {
      const estimatedCost = (litersNum / 1000) * settings.waterRatePerM3;
      updateGoal(litersNum, estimatedCost);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="btn-back-savings-goal"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-white">Limite Mensal</h2>
          <p className="text-xs text-zinc-400">Defina seu limite e acompanhe o consumo mensal</p>
        </div>
      </div>

      {/* Main Circular Progress Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#015486]/60 via-[#181818] to-zinc-900 border border-[#2ba6e2]/40 text-center space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#99d6ee] uppercase tracking-wider">
            Progresso do Limite
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2ba6e2]/20 text-[#99d6ee] border border-[#2ba6e2]/30">
            {percent <= 80 ? 'Excelente' : percent <= 95 ? 'Atenção' : 'Limite'}
          </span>
        </div>

        {/* Circular Ring Graphic */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="68" stroke="#27272a" strokeWidth="12" fill="transparent" />
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#2ba6e2"
              strokeWidth="12"
              strokeDasharray={427}
              strokeDashoffset={427 - (427 * percent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white font-mono">{percent}%</span>
            <span className="text-[10px] text-zinc-400 font-medium uppercase">Consumido</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-white">
            {currentLiters.toLocaleString('pt-BR')} Litros <span className="text-zinc-500">/ {targetNum.toLocaleString('pt-BR')} Litros</span>
          </div>
          <p className="text-xs text-zinc-400">
            Você ainda pode consumir até <span className="text-[#99d6ee] font-bold">{Math.max(0, targetNum - currentLiters).toLocaleString('pt-BR')} L</span> antes de atingir o limite.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full py-2.5 rounded-xl bg-[#015486] text-white font-semibold text-xs hover:bg-[#2ba6e2] transition-colors"
          id="btn-edit-monthly-goal"
        >
          {isEditing ? 'Cancelar Ajuste' : 'Ajustar Limite Mensal'}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveGoal} className="p-4 rounded-3xl bg-[#242424] border border-zinc-700 space-y-3">
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Definir Novo Limite em Litros
          </h3>
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Limite Mensal (Litros):</label>
            <input
              type="number"
              value={targetLiters}
              onChange={(e) => setTargetLiters(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#2ba6e2]"
              placeholder="8000"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#2ba6e2] text-white font-bold text-xs hover:brightness-110"
            id="btn-save-new-goal"
          >
            Confirmar e Salvar Novo Limite
          </button>
        </form>
      )}

      {/* Goal History */}
      <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-3">
        <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Histórico de Metas Concluídas
        </h3>

        <div className="space-y-2">
          {savingsGoal.history.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white">{item.month}</h4>
                <p className="text-[11px] text-zinc-400">
                  Consumo: {item.achievedLiters.toLocaleString('pt-BR')} L / Meta: {item.targetLiters.toLocaleString('pt-BR')} L
                </p>
              </div>
              {item.met ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Batida
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Superou Meta
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
