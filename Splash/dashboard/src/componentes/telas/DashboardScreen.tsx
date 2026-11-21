import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// ============================================================================
// 📊 DASHBOARD PRINCIPAL (Tela Inicial)
// ============================================================================
// Apresenta a visão geral de consumo diário, status de conexão do sensor ESP32,
// estimativa de fatura acumulada, progresso do limite mensal e histórico em gráficos.
export const DashboardScreen: React.FC = () => {
  const {
    user,
    setScreen,
    litersToday,
    savingsGoal,
    devices,
    isOffline,
    isSimulatingLeak,
    hourlyData,
    dailyData,
    addToast,
    getCalculatedBill,
    apiConnected,
    apiError,
    lastMeasurementAt,
    monthlyData,
    yearlyData,
    monthlyCost,
    refreshApiData
  } = useApp();

  // Estados locais para controle de visualização do gráfico
  const [chartMode, setChartMode] = useState<
  'hourly' | 'daily' | 'monthly' | 'yearly'
  >('hourly');
  const [chartType] = useState<'area' | 'bar'>('area');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dados do nó de hardware principal conectado
  const mainDevice = devices[0] || {
    name: 'ESP32 Principal',
    status: 'online',
    wifiSignal: 92,
    sensorModel: 'ZJ-S201',
    lastSync: 'Agora mesmo'
  };

  // Status de conectividade: online e não em modo offline simulado
  const isConnected = apiConnected && !isOffline;

  // Cálculos dinâmicos da conta baseados nas faixas da concessionária regional
  const calculatedMonthlyBill = getCalculatedBill(savingsGoal.currentLitersMonthly);
  const monthlyBillTotal = monthlyCost?.total ?? calculatedMonthlyBill.totalCost;

  // Porcentagem de consumo em relação ao limite mensal
  const goalPercent = Math.min(
    100,
    Math.round((savingsGoal.currentLitersMonthly / savingsGoal.targetLitersMonthly) * 100)
  );

  // Ação de sincronização manual com o sensor IoT
  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await refreshApiData();
      if (updated) {
        addToast('success', 'Dados atualizados', 'A dashboard consultou novamente a API Splash.');
      } else {
        addToast('error', 'Falha na sincronização', 'Não foi possível atualizar os dados da API. Verifique o backend.');
      }
    } catch {
      addToast('error', 'Falha na sincronização', 'Não foi possível atualizar os dados da API.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-5 text-white max-w-5xl mx-auto">
      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 1: CABEÇALHO COM BOAS-VINDAS E STATUS DO ESP32 (VERDE / CINZA)   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-white leading-tight">
            Olá, {user.name.split(' ')[0]} 👋
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <span>Residência Principal</span>
            <span className="text-zinc-600">•</span>
            {/* Indicador visual de conexão: bolinha verde (ativo) ou cinza (desconectado) */}
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isConnected
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/60 animate-pulse'
                    : 'bg-zinc-500'
                }`}
                aria-hidden="true"
              />
              <span className={isConnected ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                {isConnected ? 'API Conectada' : 'API sem conexão'}
              </span>
            </span>
          </div>
        </div>

        {/* Botão de sincronização manual */}
        <button
          onClick={handlePullToRefresh}
          disabled={isRefreshing}
          className={`p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer ${
            isRefreshing ? 'animate-spin text-[#2ba6e2]' : ''
          }`}
          title="Sincronizar dados com o ESP32"
          aria-label="Sincronizar dados"
          id="btn-refresh-dashboard"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {apiError && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200" role="status">
          Não foi possível carregar dados reais da API. Verifique se o backend está ativo em localhost:3000. ({apiError})
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 3: CARD PRINCIPAL - CONSUMO REGISTRADO HOJE & VALOR CONVERTIDO   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card em destaque com gradiente Splash */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#015486] via-[#103a58] to-[#181818] border border-[#2ba6e2]/40 shadow-xl shadow-[#015486]/20 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-[#2ba6e2]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#2ba6e2]/20 flex items-center justify-center text-[#2ba6e2]">
                  <Droplet className="w-5 h-5 fill-[#2ba6e2]/30" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99d6ee] block">
                    Consumo Registrado Hoje
                  </span>
                  <span className="text-[10px] text-zinc-300">
                    Sensor ZJ-S201 • ESP32
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-black/40 text-zinc-300 border border-white/10">
                {lastMeasurementAt ? new Date(lastMeasurementAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : (apiConnected ? 'Sem medições' : 'Sem conexão')}
              </span>
            </div>

            <div className="pt-2 grid grid-cols-1 gap-4">
              {/* Litros medidos */}
              <div>
                <span className="text-xs text-white/70 font-medium block">
                  Litros Consumidos
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {litersToday.toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-[#99d6ee]">L</span>
                </div>
                <p className="text-[10px] text-white/50 mt-1">
                  Passados pelo sensor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* SEÇÃO 4: RESUMO DE FATURA & LIMITE MENSAL (GRÁFICO DE ROSCA)        */}
        {/* -------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Estimativa da Fatura Mensal (Multiplicado por 2x água + esgoto) */}
          <div
            onClick={() => setScreen('bill')}
            className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            id="card-estimated-bill"
            aria-label="Ver detalhes do cálculo da fatura"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <div className="mt-3">
              <span className="text-xs text-zinc-400 font-medium">Valor Estimado da Conta</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5">
                R$ {monthlyBillTotal.toFixed(2)}
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium mt-1 truncate">
                {calculatedMonthlyBill.hasSewage ? '(Multiplicado por 2x • água + esgoto)' : '(Sem cobrança de esgoto)'}
              </p>
            </div>
          </div>

          {/* Card: Limite Mensal com Gráfico de Rosca (Donut) Ampliado */}
          <div
            onClick={() => setScreen('savings_goal')}
            className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            id="card-monthly-limit"
            aria-label="Ver metas e limites mensais"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Limite Mensal</span>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>

            <div className="flex items-center gap-4 my-2.5">
              {/* Gráfico de Rosca Ampliado */}
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    stroke="#2a2a30"
                    strokeWidth="6.5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    stroke={goalPercent > 90 ? '#ef4444' : '#2ba6e2'}
                    strokeWidth="6.5"
                    strokeDasharray={207.34}
                    strokeDashoffset={207.34 - (207.34 * Math.min(goalPercent, 100)) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg font-black font-mono text-white leading-none">
                    {goalPercent}%
                  </span>
                  <span className="text-[9px] text-zinc-400 font-medium uppercase mt-0.5">Uso</span>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-base sm:text-lg font-extrabold text-white font-mono truncate">
                  {savingsGoal.currentLitersMonthly.toLocaleString('pt-BR')} L
                </div>
                <p className="text-xs text-zinc-400">
                  Meta: <strong className="text-zinc-200 font-mono">{savingsGoal.targetLitersMonthly.toLocaleString('pt-BR')} L</strong>
                </p>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  goalPercent > 90 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-[#2ba6e2]/20 text-[#99d6ee]'
                }`}>
                  {goalPercent < 100 
                    ? `${(savingsGoal.targetLitersMonthly - savingsGoal.currentLitersMonthly).toLocaleString('pt-BR')} L restantes` 
                    : 'Limite atingido'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 5: HISTÓRICO DE CONSUMO - GRÁFICOS INTERATIVOS                  */}
      {/* ---------------------------------------------------------------------- */}
      <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#2ba6e2]" />
            <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
              Histórico de Consumo
            </h3>
          </div>

          {/* Alternador de período: Hoje (horas) vs Semana (dias) */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
            <button
              onClick={() => setChartMode('hourly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                chartMode === 'hourly' ? 'bg-[#015486] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              id="btn-chart-mode-today"
            >
              Hoje
            </button>
            <button
              onClick={() => setChartMode('daily')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cuAreaChartrsor-pointer ${
                chartMode === 'daily' ? 'bg-[#015486] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              id="btn-chart-mode-week"
            >
              Semana
            </button>
          </div>
        </div>

        {/* Visualização interativa com Recharts */}
        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={
                  chartMode === 'hourly'
                    ? hourlyData.map((item) => ({
                        ...item,
                        hour: item.hour,
                      }))
                    : dailyData.map((item) => ({
                        ...item,
                        hour: item.label,
                      }))
                }
              >
                <defs>
                  <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ba6e2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2ba6e2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey={chartMode === 'hourly' ? 'hour' : 'label'} stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`${val} Litros`, 'Consumo']}
                />
                <Area type="monotone" dataKey="liters" stroke="#2ba6e2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLiters)" />
              </AreaChart>
            ) : (
               <BarChart
                  data={
                    chartMode === 'hourly'
                      ? hourlyData.map((item) => ({
                          ...item,
                          timestamp: item.hour,
                          label: item.hour,
                        }))
                      : dailyData
                  }
                >
                <XAxis dataKey={chartMode === 'hourly' ? 'hour' : 'label'} stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="liters" fill="#2ba6e2" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Link para a tela completa de Consumo & Metas */}
        <button
          onClick={() => setScreen('consumption')}
          className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-[#99d6ee] font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          id="btn-view-detailed-consumption"
        >
          <span>Acessar Tela de Consumo & Metas</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
