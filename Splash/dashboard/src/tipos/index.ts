// ============================================================================
// 📱 SPLASH IOT - TIPOS & ESTRUTURAS DE DADOS DO SISTEMA
// ============================================================================
// Este arquivo centraliza todas as interfaces, modelos de dados e definições de
// tipos do aplicativo Splash (Monitoramento Residencial Inteligente de Água via ESP32).

// ----------------------------------------------------------------------------
// 1. ROTAS & NAVEGAÇÃO DE TELAS (AppScreen)
// ----------------------------------------------------------------------------
export type AppScreen =
  // Telas Iniciais & Autenticação
  | 'splash'         // Tela de Apresentação
  | 'onboarding'     // Guia de Primeiros Passos
  | 'login'          // Tela de Acesso / Login
  | 'register'       // Cadastro de Nova Conta
  // Telas Principais do Usuário
  | 'dashboard'      // Painel Geral (Tela Inicial)
  | 'consumption'    // Consumo de Água (Gráficos, Meta Mensal e Média Diária)
  | 'profile'        // Perfil do Usuário e Aba de Hardware IoT
  // Telas Financeiras e Metas
  | 'bill'           // Valor da Conta & Tarifas Regionais
  | 'savings_goal'   // Metas de Economia & Limite Mensal
  | 'charts'         // Análise Avançada de Gráficos
  // Telas de Segurança, Notificações & Ajustes
  | 'alerts'         // Central de Alertas & Notificações
  | 'leaks'          // Inspecionar Vazamentos Detectados
  | 'devices'        // Dispositivo Conectado (Nó ESP32 Único)
  | 'history'        // Histórico de Leituras
  | 'statistics'     // Estatísticas Gerais
  | 'notifications'  // Histórico de Avisos
  | 'settings'       // Configurações do App (Tema Claro/Escuro, Idioma)
  | 'help';          // Central de Ajuda e Suporte

// Idiomas suportados pelo sistema
export type Language = 'pt' | 'en' | 'es';

// ----------------------------------------------------------------------------
// 2. CONFIGURAÇÃO DO IMÓVEL & TARIFAS (As 6 Perguntas Regulatórias)
// ----------------------------------------------------------------------------
export interface UserWaterProfile {
  /** 1. Onde você mora? Estado da federação (UF: SP, RJ, MG, etc.) */
  state: string;
  /** 1. Onde você mora? Município/Cidade da residência */
  city: string;
  /** 2. Qual é o tipo de imóvel? (Residencial, Comercial ou Outro) */
  propertyType: 'Residencial' | 'Comercial' | 'Outro';
  /** 3. Sua conta possui cobrança de esgoto? ('Sim' duplica o valor da conta) */
  hasSewageCharge: 'Sim' | 'Não' | 'Não sei';
  /** 4. Você possui benefício de Tarifa Social / CadÚnico? */
  hasSocialTariff: 'Sim' | 'Não' | 'Não sei';
  socialTariffCategory?: 'vulneravel' | 'social' | 'social2' | 'residencial';
}

// ----------------------------------------------------------------------------
// 3. PERFIL DO USUÁRIO & GAMIFICAÇÃO ECO-CONSCIENTE
// ----------------------------------------------------------------------------

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  totalSavedLiters: number;
  totalSavedMoney: number;
  consecutiveSavingDays: number;
  badges: Badge[];
  waterProfile?: UserWaterProfile;
}


export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// ----------------------------------------------------------------------------
// 4. HARDWARE IOT & TELEMETRIA DO SENSOR ESP32
// ----------------------------------------------------------------------------
export interface DeviceInfo {
  id: string;
  name: string;               // Ex: "ESP32 Hidrômetro Principal"
  model: string;              // Ex: "NodeMCU WROOM-32"
  sensorModel: string;        // Ex: "ZJ-S201 Flow Sensor (Hall G1/2\")"
  firmware: string;           // Ex: "v2.4.1-SplashOS"
  ip: string;                 // IP na rede local
  mac: string;                // Endereço físico MAC
  wifiSignal: number;         // Porcentagem de intensidade (0% a 100%)
  wifiRssi: number;           // Nível de sinal em decibéis (dBm)
  uptimeDays: number;         // Dias de operação ininterrupta
  status: 'online' | 'offline' | 'calibrating';
  lastSync: string;           // Timestamp da última telemetria
  flowRateLmin: number;       // Vazão instantânea em Litros por Minuto (L/min)
  kFactor: number;            // Fator K de pulsos do sensor (padrão 7.5 pulsos/L)
}

// ----------------------------------------------------------------------------
// 5. REGISTROS DE CONSUMO & PONTOS DE GRÁFICO
// ----------------------------------------------------------------------------
export interface WaterConsumptionPoint {
  label: string;
  timestamp: string;
  liters: number;
  cost: number;
  previousLiters?: number;
}

export interface HourlyConsumption {
  hour: string;
  liters: number;
  cost: number;
  category?: 'shower' | 'faucet' | 'washing' | 'garden' | 'leak' | 'other';
}

// ----------------------------------------------------------------------------
// 6. CENTRAL DE ALERTAS & DETECÇÃO DE ANOMALIAS
// ----------------------------------------------------------------------------
export interface WaterAlert {
  id: string;
  title: string;
  description: string;
  type: 'leak' | 'high_consumption' | 'sensor_disconnected' | 'esp32_offline' | 'no_internet' | 'goal_exceeded';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  date: string;
  read: boolean;
  recommendation: string;
  litersWasted?: number;
  financialImpact?: number;
}

export interface LeakRecord {
  id: string;
  detectedTime: string;
  detectedDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  durationMinutes: number;
  wastedLiters: number;
  wastedCost: number;
  status: 'active' | 'resolved' | 'ignored';
  locationEstimate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'today' | 'yesterday' | 'this_week';
  read: boolean;
  type: 'alert' | 'info' | 'success' | 'warning';
}

// ----------------------------------------------------------------------------
// 7. METAS DE ECONOMIA & LIMITES MENSAIS
// ----------------------------------------------------------------------------
export interface SavingsGoal {
  targetLitersMonthly: number;
  targetCostMonthly: number;
  currentLitersMonthly: number;
  currentCostMonthly: number;
  history: { month: string; targetLiters: number; achievedLiters: number; met: boolean }[];
}

// ----------------------------------------------------------------------------
// 8. CONFIGURAÇÕES GERAIS DO APLICATIVO
// ----------------------------------------------------------------------------
export interface AppSettings {
  theme: 'dark' | 'light';
  language: Language;
  waterRatePerM3: number;
  notificationsEnabled: boolean;
  leakAlertsEnabled: boolean;
  dailySummaryEnabled: boolean;
  goalAlertsEnabled: boolean;
  soundEffects: boolean;
  rememberLogin: boolean;
  autoSyncIntervalSec: number;
}

// Mensagens flutuantes de feedback (Toast)
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
