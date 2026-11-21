import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Calendar,
  Layers,
  ArrowLeft,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export const ChartsDetailScreen: React.FC = () => {
  const { setScreen, hourlyData, dailyData, monthlyData, yearlyData, addToast } = useApp();

  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'monthly' | 'yearly' | 'comparison'>('daily');
  const [chartStyle, setChartStyle] = useState<'area' | 'bar'>('area');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const getActiveData = () => {
    switch (timeframe) {
      case 'hourly':
        return hourlyData;
      case 'daily':
        return dailyData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
      case 'comparison':
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

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setSelectedPoint(state.activePayload[0].payload);
      addToast(
        'info',
        `Detalhamento: ${state.activePayload[0].payload.label || state.activePayload[0].payload.hour}`,
        `Consumo registrado: ${state.activePayload[0].payload.liters} Litros (R$ ${state.activePayload[0].payload.cost.toFixed(2)})`
      );
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            id="btn-back-charts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-white">Análise de Gráficos</h2>
            <p className="text-xs text-zinc-400">Detalhamento visual do sensor ZJ-S201</p>
          </div>
        </div>

        <button
          onClick={() => setScreen('history')}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[#99d6ee] hover:text-white hover:bg-zinc-800 transition-colors"
          title="Exportar dados"
          id="btn-export-from-charts"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Timeframe selector tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'hourly', label: 'Diário (Horas)' },
          { id: 'daily', label: 'Semanal (Dias)' },
          { id: 'monthly', label: 'Mensal (Mêses)' },
          { id: 'yearly', label: 'Anual' },
          { id: 'comparison', label: 'Comparação Anos' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTimeframe(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              timeframe === tab.id
                ? 'bg-[#015486] border-[#2ba6e2] text-white shadow-md shadow-[#015486]/30'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            id={`tab-chart-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Chart Container */}
      <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#2ba6e2]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {timeframe === 'comparison' ? 'Comparativo de Anos' : 'Consumo em Litros'}
            </span>
          </div>

          {/* Toggle Area vs Bar */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
            <button
              onClick={() => setChartStyle('area')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                chartStyle === 'area' ? 'bg-[#015486] text-white' : 'text-zinc-400'
              }`}
            >
              Linha
            </button>
            <button
              onClick={() => setChartStyle('bar')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                chartStyle === 'bar' ? 'bg-[#015486] text-white' : 'text-zinc-400'
              }`}
            >
              Barras
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartStyle === 'area' ? (
              <AreaChart data={chartData} onClick={handleChartClick}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ba6e2" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2ba6e2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey={timeframe === 'hourly' ? 'hour' : 'label'} stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="liters" stroke="#2ba6e2" strokeWidth={3} fillOpacity={1} fill="url(#chartColor)" />
                {timeframe === 'comparison' && (
                  <Area type="monotone" dataKey="previousLiters" stroke="#99d6ee" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                )}
              </AreaChart>
            ) : (
              <BarChart data={chartData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey={timeframe === 'hourly' ? 'hour' : 'label'} stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="liters" fill="#2ba6e2" radius={[6, 6, 0, 0]} />
                {timeframe === 'comparison' && (
                  <Bar dataKey="previousLiters" fill="#015486" radius={[6, 6, 0, 0]} />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#2ba6e2]" /> Toque nos pontos do gráfico para ver detalhes por hora/dia.
        </p>
      </div>

      {/* Selected Point Breakdown */}
      {selectedPoint && (
        <div className="p-4 rounded-3xl bg-[#015486]/30 border border-[#2ba6e2]/40 space-y-2">
          <h4 className="font-bold text-xs text-[#99d6ee] uppercase tracking-wider">
            Detalhamento do Ponto Selecionado
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] text-zinc-400">Período</span>
              <div className="text-xs font-bold text-white">{selectedPoint.label || selectedPoint.hour}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] text-zinc-400">Consumo</span>
              <div className="text-xs font-bold text-[#2ba6e2] font-mono">{selectedPoint.liters} L</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] text-zinc-400">Custo Estimado</span>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                R$ {selectedPoint.cost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
