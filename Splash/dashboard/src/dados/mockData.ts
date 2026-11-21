import {
  UserProfile,
  DeviceInfo,
  WaterAlert,
  LeakRecord,
  AppNotification,
  SavingsGoal,
  HourlyConsumption,
  WaterConsumptionPoint
} from '../tipos';


export const initialUserProfile: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  memberSince: '',
  totalSavedLiters: 0,
  totalSavedMoney: 0,
  consecutiveSavingDays: 0,
  badges: [
    {
      id: 'b1',
      title: 'Vazamento Zero',
      description: '30 dias sem registros de vazamentos na residência',
      icon: 'ShieldCheck',
      unlockedAt: '12/01/2026'
    },
    {
      id: 'b2',
      title: 'Mestre da Economia',
      description: 'Reduziu o consumo mensal em mais de 20%',
      icon: 'TrendingDown',
      unlockedAt: '01/02/2026'
    },
    {
      id: 'b3',
      title: 'Pioneiro do IoT',
      description: 'Conectou o ESP32 e calibrou o sensor ZJ-S201 com sucesso',
      icon: 'Cpu',
      unlockedAt: '15/10/2025'
    },
    {
      id: 'b4',
      title: 'Eco Consciência',
      description: 'Bateu a meta de consumo por 3 meses consecutivos',
      icon: 'Award',
      unlockedAt: '04/07/2026'
    }
  ]
};

export const initialDevices: DeviceInfo[] = [
  {
    id: 'esp32-main-01',
    name: 'ESP32 Hidrômetro Principal',
    model: 'NodeMCU WROOM-32 (38-pin)',
    sensorModel: 'ZJ-S201 Flow Sensor (Hall G1/2")',
    firmware: 'v2.4.1-SplashOS',
    ip: '192.168.1.105',
    mac: '24:6F:28:AB:C1:99',
    wifiSignal: 92,
    wifiRssi: -56,
    uptimeDays: 14,
    status: 'online',
    lastSync: 'Agora mesmo',
    flowRateLmin: 0.0,
    kFactor: 7.5
  },
  {
    id: 'esp32-sub-02',
    name: 'ESP32 Reserva / Jardim',
    model: 'ESP32-CAM Dual Core',
    sensorModel: 'ZJ-S201 Flow Sensor G3/4"',
    firmware: 'v2.3.8-SplashOS',
    ip: '192.168.1.109',
    mac: '24:6F:28:CF:88:12',
    wifiSignal: 78,
    wifiRssi: -68,
    uptimeDays: 5,
    status: 'online',
    lastSync: 'Há 2 minutos',
    flowRateLmin: 0.0,
    kFactor: 7.5
  }
];

export const hourlyDataToday: HourlyConsumption[] = [
  { hour: '00:00', liters: 0.0, cost: 0.00 },
  { hour: '02:00', liters: 0.0, cost: 0.00 },
  { hour: '04:00', liters: 0.0, cost: 0.00 },
  { hour: '06:00', liters: 12.5, cost: 0.08, category: 'faucet' },
  { hour: '07:00', liters: 42.0, cost: 0.27, category: 'shower' },
  { hour: '08:00', liters: 18.2, cost: 0.12, category: 'washing' },
  { hour: '10:00', liters: 6.4, cost: 0.04, category: 'faucet' },
  { hour: '12:00', liters: 14.8, cost: 0.10, category: 'faucet' },
  { hour: '14:00', liters: 8.5, cost: 0.06, category: 'other' },
  { hour: '16:00', liters: 5.2, cost: 0.03, category: 'faucet' },
  { hour: '18:00', liters: 32.1, cost: 0.21, category: 'shower' },
  { hour: '20:00', liters: 11.4, cost: 0.07, category: 'faucet' },
  { hour: '22:00', liters: 3.5, cost: 0.02, category: 'faucet' },
];

export const dailyDataWeek: WaterConsumptionPoint[] = [
  { label: 'Seg', timestamp: '2026-08-01', liters: 138, cost: 0.90, previousLiters: 165 },
  { label: 'Ter', timestamp: '2026-08-02', liters: 145, cost: 0.94, previousLiters: 170 },
  { label: 'Qua', timestamp: '2026-08-03', liters: 128, cost: 0.83, previousLiters: 155 },
  { label: 'Qui', timestamp: '2026-08-04', liters: 162, cost: 1.05, previousLiters: 180 },
  { label: 'Sex', timestamp: '2026-08-05', liters: 142, cost: 0.92, previousLiters: 160 },
  { label: 'Sáb', timestamp: '2026-08-06', liters: 195, cost: 1.27, previousLiters: 210 },
  { label: 'Dom', timestamp: '2026-08-07', liters: 178, cost: 1.16, previousLiters: 198 }
];

export const monthlyDataYear: WaterConsumptionPoint[] = [
  { label: 'Jan', timestamp: '2026-01', liters: 4850, cost: 31.52, previousLiters: 5600 },
  { label: 'Fev', timestamp: '2026-02', liters: 4620, cost: 30.03, previousLiters: 5400 },
  { label: 'Mar', timestamp: '2026-03', liters: 4410, cost: 28.66, previousLiters: 5200 },
  { label: 'Abr', timestamp: '2026-04', liters: 4300, cost: 27.95, previousLiters: 5100 },
  { label: 'Mai', timestamp: '2026-05', liters: 4750, cost: 30.87, previousLiters: 5350 },
  { label: 'Jun', timestamp: '2026-06', liters: 4200, cost: 27.30, previousLiters: 4900 },
  { label: 'Jul', timestamp: '2026-07', liters: 4100, cost: 26.65, previousLiters: 4800 },
  { label: 'Ago', timestamp: '2026-08', liters: 4260, cost: 27.69, previousLiters: 4950 }
];

export const yearlyDataComparison: WaterConsumptionPoint[] = [
  { label: '2023', timestamp: '2023', liters: 68400, cost: 444.60, previousLiters: 72000 },
  { label: '2024', timestamp: '2024', liters: 61200, cost: 397.80, previousLiters: 68400 },
  { label: '2025', timestamp: '2025', liters: 54900, cost: 356.85, previousLiters: 61200 },
  { label: '2026 (Até agora)', timestamp: '2026', liters: 35490, cost: 230.68, previousLiters: 41000 }
];

export const initialAlerts: WaterAlert[] = [
  {
    id: 'alt-101',
    title: 'Possível Vazamento Detectado',
    description: 'Fluxo constante de 0.8 L/min detectado durante 45 minutos contínuos na madrugada.',
    type: 'leak',
    riskLevel: 'high',
    timestamp: '03:42 AM',
    date: 'Hoje, 05 de Agosto',
    read: false,
    recommendation: 'Verifique a descarga do vaso sanitário, torneiras pingando ou tubulações embutidas.',
    litersWasted: 36.0,
    financialImpact: 0.23
  },
  {
    id: 'alt-102',
    title: 'Consumo Muito Alto',
    description: 'O consumo entre 07:00 e 08:00 superou em 65% a média histórica dos seus banhos.',
    type: 'high_consumption',
    riskLevel: 'medium',
    timestamp: '08:15 AM',
    date: 'Hoje, 05 de Agosto',
    read: false,
    recommendation: 'Recomendamos reduzir a duração do banho de 15 minutos para 8 minutos.',
    litersWasted: 18.5,
    financialImpact: 0.12
  },
  {
    id: 'alt-103',
    title: 'Meta Mensal Atingiu 50%',
    description: 'Você consumiu metade da sua meta de 8.000 Litros em apenas 12 dias de mês.',
    type: 'goal_exceeded',
    riskLevel: 'low',
    timestamp: '18:00 PM',
    date: 'Ontem, 04 de Agosto',
    read: true,
    recommendation: 'Adapte o uso diário para manter o consumo abaixo de 260 L/dia até o fim do mês.'
  },
  {
    id: 'alt-104',
    title: 'Oscilação no Sinal Wi-Fi do ESP32',
    description: 'A intensidade do sinal Wi-Fi caiu para -82 dBm momentaneamente.',
    type: 'esp32_offline',
    riskLevel: 'low',
    timestamp: '14:20 PM',
    date: '03 de Agosto',
    read: true,
    recommendation: 'Caso persista, aproxime o repetidor de sinal Wi-Fi da caixa de medição de água.'
  }
];

export const initialLeaks: LeakRecord[] = [
  {
    id: 'leak-201',
    detectedTime: '03:42:10',
    detectedDate: '05/08/2026',
    riskLevel: 'high',
    durationMinutes: 42,
    wastedLiters: 33.6,
    wastedCost: 0.22,
    status: 'active',
    locationEstimate: 'Vaso Sanitário (Banheiro Suíte)'
  },
  {
    id: 'leak-202',
    detectedTime: '13:15:00',
    detectedDate: '28/07/2026',
    riskLevel: 'medium',
    durationMinutes: 120,
    wastedLiters: 84.0,
    wastedCost: 0.55,
    status: 'resolved',
    locationEstimate: 'Torneira da Lavanderia Pingando'
  },
  {
    id: 'leak-203',
    detectedTime: '22:05:30',
    detectedDate: '15/07/2026',
    riskLevel: 'low',
    durationMinutes: 15,
    wastedLiters: 10.5,
    wastedCost: 0.07,
    status: 'ignored',
    locationEstimate: 'Mangueira de Jardim Mal Vedada'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Alerta de Vazamento Noturno',
    message: 'Detectado fluxo contínuo de 0.8 L/min no ESP32 Principal.',
    timestamp: '03:42',
    category: 'today',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-2',
    title: 'Resumo Diário Disponível',
    message: 'Ontem você economizou 18.5 Litros em relação à semana passada. Parabéns!',
    timestamp: '08:00',
    category: 'today',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-3',
    title: 'Firmware Atualizado',
    message: 'O ESP32 atualizou automaticamente para a versão v2.4.1 com correção de calibração.',
    timestamp: '21:30',
    category: 'yesterday',
    read: true,
    type: 'info'
  },
  {
    id: 'notif-4',
    title: 'Dica de Sustentabilidade',
    message: 'Fechar a torneira ao escovar os dentes pode economizar até 12 Litros de água por dia.',
    timestamp: '11:00',
    category: 'this_week',
    read: true,
    type: 'info'
  }
];

export const initialSavingsGoal: SavingsGoal = {
  targetLitersMonthly: 8000,
  targetCostMonthly: 52.00,
  currentLitersMonthly: 4260,
  currentCostMonthly: 27.69,
  history: [
    { month: 'Julho 2026', targetLiters: 8000, achievedLiters: 7420, met: true },
    { month: 'Junho 2026', targetLiters: 8000, achievedLiters: 7850, met: true },
    { month: 'Maio 2026', targetLiters: 8500, achievedLiters: 8900, met: false },
    { month: 'Abril 2026', targetLiters: 8500, achievedLiters: 8100, met: true }
  ]
};

export const tccFaqList = [
  {
    q: 'O aplicativo Splash pode fechar registros ou interromper o fornecimento de água?',
    a: 'Não. O Splash NÃO controla registros, válvulas ou o fornecimento de água. Sua função é exclusivamente monitorar, calcular e apresentar informações sobre o consumo de forma simples e intuitiva, notificando o usuário sobre possíveis vazamentos e gastos.'
  },
  {
    q: 'Como o ESP32 se comunica com o aplicativo Splash?',
    a: 'O ESP32 lê os pulsos do sensor de vazão ZJ-S201 via pino digital (Interruptor GPIO2). Os pulsos são convertidos em frequência (Hz) e calculados em Litros/minuto através do fator K (K=7.5). Em seguida, os dados são enviados via protocolo HTTP/MQTT por Wi-Fi para o nosso servidor backend.'
  },
  {
    q: 'Qual o custo aproximado do hardware para montar o Splash?',
    a: 'O hardware é extremamente acessível. Um microcontrolador ESP32 custa aproximadamente R$ 35,00 e o sensor de fluxo Hall ZJ-S201 custa cerca de R$ 25,00, totalizando menos de R$ 70,00 de investimento.'
  },
  {
    q: 'Como o Splash detecta um vazamento residencial?',
    a: 'O sistema utiliza um algoritmo inteligente de monitoramento de fluxo contínuo. Caso haja fluxo de água ininterrupto (mesmo que de baixa vazão, ex: 0.5 L/min) durante um período configurável (ex: 30 minutos sem pausas), o aplicativo aciona imediatamente um alerta de vazamento.'
  },
  {
    q: 'Como é calculada a estimativa financeira da conta de água?',
    a: 'O aplicativo utiliza a tarifa padrão por metro cúbico (m³ = 1000 Litros) definida nas configurações (ex: R$ 6.50/m³), somada às taxas de saneamento/esgoto locais. Toda a medição em litros é convertida em tempo real para Reais (R$).'
  },
  {
    q: 'O aplicativo funciona offline se a internet cair?',
    a: 'Sim! O ESP32 possui memória Flash interna (EEPROM/SPIFFS) que armazena as medições locais caso a rede caia. Quando a conexão Wi-Fi restabelece, todos os dados pendentes são sincronizados com o aplicativo.'
  }
];
