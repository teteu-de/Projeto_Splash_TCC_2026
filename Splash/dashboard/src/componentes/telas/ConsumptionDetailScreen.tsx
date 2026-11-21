import React, { useState } from 'react';
import { ArrowLeft, Target, Calendar, BarChart2 } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// ============================================================================
// 💧 TELA DE CONSUMO DE ÁGUA
// ============================================================================
// Apresenta exclusivamente as 3 métricas centrais solicitadas:
// 1. Quantidade de Meta Mensal (litros consumidos, alvo e barra de progresso)
// 2. Média Diária de Consumo (litros por dia com base nos dados do sensor)
// 3. Gráficos de Consumo Interativos (Diário, Semanal, Mensal e Anual)
export const ConsumptionDetailScreen: React.FC = () => {
  const {
    setScreen,
    savingsGoal,
    hourlyData,
    dailyData,
    monthlyData,
    yearlyData,
    litersToday
  } = useApp();

  // Estados locais para controle de período e estilo de gráfico
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'monthly' | 'yearly'>('daily');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Seleciona o conjunto de dados de acordo com a aba selecionada
  const getActiveData = () => {
    switch (timeframe) {
      case 'hourly':
        return hourlyData;
      case 'daily':
        return dailyData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return dailyData;
    }
  };

  const currentData = getActiveData();
  
  const chartData = currentData.map((item) => {
    const label = 'hour' in item ? item.hour : item.label;

    return {
      ...item,
      hour: label,
      label,
      timestamp: 'timestamp' in item ? item.timestamp : label,
    };
  });


  // Métricas de Meta Mensal
  const goalPercent = Math.min(
    100,
    Math.round((savingsGoal.currentLitersMonthly / savingsGoal.targetLitersMonthly) * 100)
  );
  const remainingLiters = Math.max(0, savingsGoal.targetLitersMonthly - savingsGoal.currentLitersMonthly);

  // Média Diária de Consumo calculada com base nos registros semanais
  const totalWeekLiters = dailyData.reduce((acc, curr) => acc + curr.liters, 0);
  const dailyAverage = (totalWeekLiters / dailyData.length).toFixed(1);

  return (
    <div className="space-y-5 text-white max-w-5xl mx-auto">
      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 1: CABEÇALHO DA TELA DE CONSUMO                                  */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Voltar ao Painel Geral"
          aria-label="Voltar ao Painel Geral"
          id="btn-back-consumption"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-white">Consumo de Água</h2>
          <p className="text-xs text-zinc-400">Gráficos, meta mensal e média diária</p>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 2: META MENSAL & MÉDIA DIÁRIA DE CONSUMO                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Quantidade de Meta Mensal */}
        <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Meta Mensal
              </span>
            </div>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
              goalPercent > 90 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {goalPercent}% consumido
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {savingsGoal.currentLitersMonthly.toLocaleString('pt-BR')} L
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                de {savingsGoal.targetLitersMonthly.toLocaleString('pt-BR')} L
              </span>
            </div>

            {/* Barra de Progresso do Limite */}
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  goalPercent > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-[#015486] to-[#2ba6e2]'
                }`}
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
              <span>{remainingLiters.toLocaleString('pt-BR')} L disponíveis</span>
              <span className="text-[#99d6ee] font-medium">Calibrado via Perfil</span>
            </div>
          </div>
        </div>

        {/* Card 2: Média Diária de Consumo */}
        <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#2ba6e2]/10 text-[#2ba6e2] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Média Diária de Consumo
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Padrão OMS
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {dailyAverage}
              </span>
              <span className="text-sm font-bold text-[#99d6ee]">Litros/dia</span>
            </div>
            <p className="text-xs text-zinc-400">
              Hoje registrado: <strong className="text-white font-mono">{litersToday.toFixed(1)} L</strong>
            </p>
            <p className="text-[11px] text-zinc-500">
              Calculado com base nas medições contínuas do sensor ZJ-S201.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 3: GRÁFICOS DE CONSUMO INTERATIVOS                               */}
      {/* ---------------------------------------------------------------------- */}
      <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#2ba6e2]" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Gráficos de Consumo
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor de Período (Hoje, Semana, Mês, Ano) */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              {[
                { id: 'hourly', label: 'Hoje' },
                { id: 'daily', label: 'Semana' },
                { id: 'monthly', label: 'Mês' },
                { id: 'yearly', label: 'Ano' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    timeframe === t.id
                      ? 'bg-[#015486] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  id={`btn-timeframe-${t.id}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Alternador de Tipo de Visualização: Linha (Área) vs Barras */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartType === 'area' ? 'bg-zinc-800 text-[#2ba6e2]' : 'text-zinc-500 hover:text-white'
                }`}
                id="btn-chart-type-area"
              >
                Linha
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartType === 'bar' ? 'bg-zinc-800 text-[#2ba6e2]' : 'text-zinc-500 hover:text-white'
                }`}
                id="btn-chart-type-bar"
              >
                Barras
              </button>
            </div>
          </div>
        </div>

        {/* Container do Gráfico com Recharts */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ba6e2" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2ba6e2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey={timeframe === 'hourly' ? 'hour' : 'label'}
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`${val} Litros`, 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="liters"
                  stroke="#2ba6e2"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#consumptionGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <XAxis
                  dataKey={timeframe === 'hourly' ? 'hour' : 'label'}
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`${val} Litros`, 'Volume']}
                />
                <Bar dataKey="liters" fill="#2ba6e2" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
