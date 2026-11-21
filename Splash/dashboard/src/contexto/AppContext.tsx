import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AppScreen,
  UserProfile,
  DeviceInfo,
  WaterAlert,
  LeakRecord,
  AppNotification,
  SavingsGoal,
  AppSettings,
  ToastMessage,
  WaterConsumptionPoint,
  HourlyConsumption,
  UserWaterProfile
} from '../tipos';
import {
  initialUserProfile,
  initialDevices,
  initialAlerts,
  initialLeaks,
  initialNotifications,
  initialSavingsGoal,
  hourlyDataToday,
  dailyDataWeek,
  monthlyDataYear,
  yearlyDataComparison
} from '../dados/mockData';
import {
  defaultUserWaterProfile,
  calculateUtilityBill,
  BillCalculationResult,
  BRAZILIAN_UTILITY_PROVIDERS
} from '../dados/tariffsData';
import { getTranslation } from '../utilitarios/i18n';
import {
  fetchSplashSnapshot,
  SplashSnapshot,
  saveAuthToken,
  clearAuthToken,
} from '../conectividade/splashApi';

interface AppContextType {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  devices: DeviceInfo[];
  alerts: WaterAlert[];
  leaks: LeakRecord[];
  notifications: AppNotification[];
  savingsGoal: SavingsGoal;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  
  // Water Profile & Tariff Settings
  waterProfile: UserWaterProfile;
  updateWaterProfile: (newProfile: Partial<UserWaterProfile>) => void;
  getCalculatedBill: (liters: number) => BillCalculationResult;
  isProfileQuestionsComplete: boolean;
  setIsProfileQuestionsComplete: (completed: boolean) => void;
  validateAndSaveWaterProfile: (profile: UserWaterProfile) => { success: boolean; errors: string[] };
  
  // Real device/API telemetry
  apiConnected: boolean;
  apiError: string | null;
  lastMeasurementAt: string | null;
  monthlyCost: SplashSnapshot['monthlyCost'] | null;
  refreshApiData: () => Promise<boolean>;

  // Real time simulation state
  currentFlowLmin: number;
  litersToday: number;
  estimatedCostToday: number;
  isTapOpen: boolean;
  toggleTap: () => void;
  isSimulatingLeak: boolean;
  toggleLeakSimulation: () => void;
  isOffline: boolean;
  toggleOffline: () => void;
  
  // Frame mode (Mobile mockup container vs Full Width)
  mobileFrameMode: boolean;
  setMobileFrameMode: (enabled: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Actions
  markAlertRead: (id: string) => void;
  deleteAlert: (id: string) => void;
  resolveLeak: (id: string) => void;
  ignoreLeak: (id: string) => void;
  restartDevice: (deviceId: string) => void;
  updateDeviceFirmware: (deviceId: string) => void;
  removeDevice: (deviceId: string) => void;
  addDevice: (device: Partial<DeviceInfo>) => void;
  updateGoal: (liters: number, cost: number) => void;
  markNotificationRead: (id: string) => void;
  triggerConfetti: () => void;
  
  // Chart Data
  hourlyData: HourlyConsumption[];
  dailyData: WaterConsumptionPoint[];
  monthlyData: WaterConsumptionPoint[];
  yearlyData: WaterConsumptionPoint[];
  
  // Auth state
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (
  name: string,
  email: string,
  pass: string,
  initialProfile?: UserWaterProfile
  ) => Promise<boolean>;
  
  // Translation helper
  t: (key: Parameters<typeof getTranslation>[1]) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<AppScreen>('login');
  const [isProfileQuestionsComplete, setIsProfileQuestionsCompleteState] = useState<boolean>(true);

  const setIsProfileQuestionsComplete = (completed: boolean) => {
    setIsProfileQuestionsCompleteState(completed);
    localStorage.setItem('splash_profile_form_completed', String(completed));
  };

  const setScreen = (newScreen: AppScreen) => {
    setScreenState(newScreen);
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [devices, setDevices] = useState<DeviceInfo[]>(initialDevices);
  const [alerts, setAlerts] = useState<WaterAlert[]>(initialAlerts);
  const [leaks, setLeaks] = useState<LeakRecord[]>(initialLeaks);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>(initialSavingsGoal);
  const [waterProfile, setWaterProfile] = useState<UserWaterProfile>(defaultUserWaterProfile);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('splash_theme') : null) as 'dark' | 'light' | null;
    return {
      theme: savedTheme || 'dark',
      language: 'pt',
      waterRatePerM3: 6.50,
      notificationsEnabled: true,
      leakAlertsEnabled: true,
      dailySummaryEnabled: true,
      goalAlertsEnabled: true,
      soundEffects: true,
      rememberLogin: true,
      autoSyncIntervalSec: 2
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('splash_theme', settings.theme);
      if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  }, [settings.theme]);

  const updateWaterProfile = (newProfile: Partial<UserWaterProfile>) => {
    setWaterProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      setUser((u) => ({ ...u, waterProfile: updated }));
      return updated;
    });
    addToast('success', 'Dados Tarifários Atualizados', 'Perfil do imóvel e tarifas regionais salvas com sucesso.');
  };

  const getCalculatedBill = (liters: number): BillCalculationResult => {
    return calculateUtilityBill(liters, waterProfile);
  };
  
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(true);
  
  // Real time simulation
  const [currentFlowLmin, setCurrentFlowLmin] = useState<number>(0.0);
  const [litersToday, setLitersToday] = useState<number>(0);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastMeasurementAt, setLastMeasurementAt] = useState<string | null>(null);
  const [monthlyCost, setMonthlyCost] = useState<SplashSnapshot['monthlyCost'] | null>(null);
  const [isTapOpen, setIsTapOpen] = useState<boolean>(false);
  const [isSimulatingLeak, setIsSimulatingLeak] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [hourlyData, setHourlyData] = useState<HourlyConsumption[]>([]);
  const [dailyData, setDailyData] = useState<WaterConsumptionPoint[]>([]);
  const [monthlyData, setMonthlyData] = useState<WaterConsumptionPoint[]>([]);
  const [yearlyData, setYearlyData] = useState<WaterConsumptionPoint[]>([]);

  // Toast Helper
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(settings.language, key);

  // Busca periodicamente dados reais do ESP32 através da API Node/Express.
  const refreshApiData = async () => {
    try {
      const snapshot = await fetchSplashSnapshot();
      setApiConnected(true);
      setApiError(null);
      setLitersToday(snapshot.todayLiters);
      setCurrentFlowLmin(snapshot.currentFlowLmin);
      setLastMeasurementAt(snapshot.lastMeasurementAt);
      setYearlyData(snapshot.yearlyData);
      setMonthlyCost(snapshot.monthlyCost);
      setSavingsGoal((prev) => ({
        ...prev,
        currentLitersMonthly: snapshot.monthLiters,
        currentCostMonthly: snapshot.monthlyCost.total
      }));
      setHourlyData(snapshot.hourlyData);
      setDailyData(snapshot.dailyData);
      setMonthlyData(snapshot.monthlyData);
      
      setDevices((prev) => prev.map((device, index) => index === 0 ? {
        ...device,
        status: 'online',
        flowRateLmin: snapshot.currentFlowLmin,
        lastSync: snapshot.lastMeasurementAt ? new Date(snapshot.lastMeasurementAt).toLocaleString('pt-BR') : 'API conectada'
      } : device));
      return true;
    } catch (error) {
      setApiConnected(false);
      setApiError(error instanceof Error ? error.message : 'Não foi possível consultar a API.');
      return false;
    }
  };

  useEffect(() => {
    void refreshApiData();
    const timer = window.setInterval(() => void refreshApiData(), 5000);
    return () => window.clearInterval(timer);
  }, []);

  // Live simulation tick (ESP32 pulse stream). Mantém o simulador apenas quando a API real não está disponível.
  useEffect(() => {
    if (apiConnected) return;
    if (isOffline) {
      setCurrentFlowLmin(0.0);
      return;
    }

    const interval = setInterval(() => {
      let flow = 0.0;
      if (isTapOpen) {
        flow += 12.4 + (Math.random() * 3.2 - 1.6); // ~12 L/min shower/tap flow
      }
      if (isSimulatingLeak) {
        flow += 1.8 + (Math.random() * 0.4 - 0.2); // ~1.8 L/min micro leak
      }
      
      setCurrentFlowLmin(Number(flow.toFixed(1)));
      
      if (flow > 0) {
        // Accumulate liters today: flow L/min * (2 sec / 60 sec)
        const addedLiters = (flow * 2) / 60;
        setLitersToday((prev) => Number((prev + addedLiters).toFixed(2)));
        
        // Also update primary ESP32 device flow rate
        setDevices((prev) =>
          prev.map((d) => (d.id === 'esp32-main-01' ? { ...d, flowRateLmin: Number(flow.toFixed(1)), lastSync: 'Agora mesmo' } : d))
        );
      } else {
        setDevices((prev) =>
          prev.map((d) => (d.id === 'esp32-main-01' ? { ...d, flowRateLmin: 0.0, lastSync: 'Agora mesmo' } : d))
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTapOpen, isSimulatingLeak, isOffline, apiConnected]);

  // Tap toggle
  const toggleTap = () => {
    if (isOffline) {
      addToast('error', 'ESP32 Desconectado', 'Não é possível ler o fluxo com a rede offline.');
      return;
    }
    const nextState = !isTapOpen;
    setIsTapOpen(nextState);
    if (nextState) {
      addToast('info', 'Torneira Aberta', 'Sensor ZJ-S201 detectando fluxo de ~12.5 L/min.');
    } else {
      addToast('success', 'Torneira Fechada', 'Fluxo interrompido.');
    }
  };

  // Leak simulator toggle
  const toggleLeakSimulation = () => {
    const nextState = !isSimulatingLeak;
    setIsSimulatingLeak(nextState);
    if (nextState) {
      const newLeak: LeakRecord = {
        id: `leak-${Date.now()}`,
        detectedTime: new Date().toLocaleTimeString('pt-BR'),
        detectedDate: new Date().toLocaleDateString('pt-BR'),
        riskLevel: 'critical',
        durationMinutes: 1,
        wastedLiters: 2.4,
        wastedCost: 0.02,
        status: 'active',
        locationEstimate: 'Simulador TCC ESP32 (Linha de Teste)'
      };
      const newAlert: WaterAlert = {
        id: `alt-${Date.now()}`,
        title: '⚠️ ALERTA DE VAZAMENTO (Simulação TCC)',
        description: 'Fluxo anômalo contínuo detectado pelo sensor Hall ZJ-S201 no ESP32 Principal!',
        type: 'leak',
        riskLevel: 'critical',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        date: 'Agora mesmo',
        read: false,
        recommendation: 'Verifique imediatamente a linha de distribuição hidráulica.',
        litersWasted: 2.4,
        financialImpact: 0.02
      };
      setLeaks((prev) => [newLeak, ...prev]);
      setAlerts((prev) => [newAlert, ...prev]);
      addToast('warning', 'Alerta de Vazamento Ativado', 'O ESP32 detectou um vazamento em tempo real!');
    } else {
      addToast('success', 'Simulação de Vazamento Encerrada', 'O fluxo retornou aos níveis normais.');
    }
  };

  // Offline toggle
  const toggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        status: nextState ? 'offline' : 'online',
        lastSync: nextState ? 'Sem conexão com servidor' : 'Agora mesmo'
      }))
    );
    if (nextState) {
      addToast('error', 'Modo Offline Ativado', 'ESP32 desconectado da rede Wi-Fi.');
    } else {
      addToast('success', 'Modo Online Restabelecido', 'ESP32 sincronizado com o servidor Splash!');
    }
  };

  
const updateSettings = (newSettings: Partial<AppSettings>) => {
  setSettings((prev) => {
    const updatedSettings = { ...prev, ...newSettings };

    if (
      newSettings.theme &&
      typeof window !== 'undefined'
    ) {
      localStorage.setItem('splash_theme', newSettings.theme);
    }

    return updatedSettings;
  });

  addToast(
    'success',
    'Configurações Atualizadas',
    'Suas preferências foram salvas com sucesso.'
  );
};


  // Actions
  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Alerta Removido', 'Notificação de alerta excluída.');
  };

  const resolveLeak = (id: string) => {
    setLeaks((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'resolved' } : l)));
    addToast('success', 'Vazamento Resolvido', 'Status atualizado no histórico de segurança.');
  };

  const ignoreLeak = (id: string) => {
    setLeaks((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'ignored' } : l)));
    addToast('info', 'Vazamento Ignorado', 'Alerta silenciado para esta ocorrência.');
  };

  const restartDevice = (deviceId: string) => {
    addToast('info', 'Reiniciando ESP32...', 'Enviando comando HTTP reboot via Wi-Fi.');
    setTimeout(() => {
      addToast('success', 'ESP32 Reiniciado', 'Dispositivo online e pronto em 192.168.1.105.');
    }, 2000);
  };

  const updateDeviceFirmware = (deviceId: string) => {
    addToast('info', 'Buscando Atualização OTA...', 'Conectando ao repositório de firmware Splash.');
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, firmware: 'v2.5.0-SplashOS (Recente)' } : d))
      );
      addToast('success', 'Firmware Atualizado', 'ESP32 atualizado para v2.5.0 com sucesso!');
      triggerConfetti();
    }, 2500);
  };

  const removeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    addToast('warning', 'Dispositivo Removido', 'Dispositivo desconectado do seu perfil Splash.');
  };

  const addDevice = (newDev: Partial<DeviceInfo>) => {
    const dev: DeviceInfo = {
      id: `esp32-${Date.now()}`,
      name: newDev.name || 'Novo ESP32 Splash',
      model: newDev.model || 'NodeMCU WROOM-32',
      sensorModel: newDev.sensorModel || 'ZJ-S201 Flow Sensor G1/2"',
      firmware: 'v2.4.1-SplashOS',
      ip: newDev.ip || '192.168.1.115',
      mac: '24:6F:28:FE:99:00',
      wifiSignal: 88,
      wifiRssi: -60,
      uptimeDays: 0,
      status: 'online',
      lastSync: 'Agora mesmo',
      flowRateLmin: 0.0,
      kFactor: 7.5
    };
    setDevices((prev) => [...prev, dev]);
    addToast('success', 'Dispositivo Pareado', 'ESP32 configurado e sincronizado com o app.');
    triggerConfetti();
  };

  const updateGoal = (liters: number, cost: number) => {
    setSavingsGoal((prev) => ({
      ...prev,
      targetLitersMonthly: liters,
      targetCostMonthly: cost
    }));
    addToast('success', 'Meta de Economia Atualizada', `Nova meta definida para ${liters.toLocaleString('pt-BR')} L/mês (R$ ${cost.toFixed(2)}).`);
    triggerConfetti();
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const validateAndSaveWaterProfile = (profile: UserWaterProfile): { success: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!profile.state || !BRAZILIAN_UTILITY_PROVIDERS[profile.state]) {
      errors.push('💧 Onde você mora: Selecione um Estado (UF) válido.');
    }
    if (!profile.city || profile.city.trim().length < 2) {
      errors.push('💧 Onde você mora: Informe o nome da sua Cidade.');
    }
    if (!profile.propertyType) {
      errors.push('🏠 Tipo de imóvel: Selecione o tipo de imóvel.');
    }
    if (!profile.hasSewageCharge) {
      errors.push('🚽 Cobrança de esgoto: Selecione se há cobrança de esgoto na conta.');
    }
    if (!profile.hasSocialTariff) {
      errors.push('🏷️ Tarifa Social: Selecione se você possui o benefício da Tarifa Social.');
    }

    if (errors.length > 0) {
      addToast('error', 'Campos Obrigatórios Pendentes', 'Por favor, preencha todos os 6 campos obrigatórios do imóvel.');
      return { success: false, errors };
    }

    setWaterProfile(profile);
    setUser((prev) => ({ ...prev, waterProfile: profile }));
    setIsProfileQuestionsComplete(true);

    const provider = BRAZILIAN_UTILITY_PROVIDERS[profile.state];
    if (provider && provider.tiers.length > 0) {
      const tier = provider.tiers.find((t) => t.waterRatePerM3) || provider.tiers[0];
      if (tier && tier.waterRatePerM3) {
        setSettings((s) => ({ ...s, waterRatePerM3: tier.waterRatePerM3! }));
      }
    }

    addToast(
      'success',
      'Perfil Calibrado com Sucesso!',
      'Tarifas e estimativas salvas. Acesso à dashboard completa liberado!'
    );
    triggerConfetti();

    return { success: true, errors: [] };
  };

  // Auth methods — autenticação real pela API Node/Express.
  
const login = async (email: string, pass: string): Promise<boolean> => {
  const emailNormalizado = email.trim().toLowerCase();

  if (!emailNormalizado || !pass) {
    addToast('error', 'Erro no Login', 'Informe seu e-mail e sua senha.');
    return false;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailNormalizado,
        senha: pass,
      }),
    });

    const data: {
      mensagem?: string;
      erro?: string;
      token?: string;
      usuario?: {
        id: number;
        nome: string;
        email: string;
        categoria_tarifaria: string;
      };
    } = await response.json();

    if (!response.ok || !data.usuario || !data.token) {
      addToast(
        'error',
        'Erro no Login',
        data.erro || 'Não foi possível autenticar sua conta.'
      );
      return false;
    }

    // Guarda o token para autenticar as consultas de consumo.
    saveAuthToken(data.token);

    setUser((prev) => ({
      ...prev,
      name: data.usuario!.nome,
      email: data.usuario!.email,
    }));

    setIsLoggedIn(true);
    setScreenState('dashboard');

    addToast(
      'success',
      'Bem-vindo ao Splash!',
      `Olá, ${data.usuario.nome}! Login realizado com sucesso.`
    );

    return true;
  } catch (error) {
    console.error('Erro ao conectar à API de login:', error);

    addToast(
      'error',
      'API indisponível',
      'Não foi possível conectar ao servidor Splash em localhost:3000.'
    );

    return false;
  }
};

  const logout = () => {
    clearAuthToken(); 
    setIsLoggedIn(false);
    setScreen('login');
    addToast('info', 'Sessão Encerrada', 'Você saiu da sua conta.');
  };


const register = async (
  name: string,
  email: string,
  pass: string,
  initialProfile?: UserWaterProfile
): Promise<boolean> => {
  const prof = initialProfile || defaultUserWaterProfile;

  // A API aceita as categorias "social" e "residencial".
  // A escolha da categoria Social II ou Vulnerável exige
  // uma informação adicional que o formulário atual não coleta.
  const categoriaTarifaria =
  prof.hasSocialTariff === 'Sim'
    ? prof.socialTariffCategory || 'social'
    : 'residencial';

  try {
    const response = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: name.trim(),
        email: email.trim().toLowerCase(),
        senha: pass,
        categoria_tarifaria: categoriaTarifaria,
      }),
    });

    const data: {
      mensagem?: string;
      erro?: string;
      usuario?: {
        id: number;
        nome: string;
        email: string;
        categoria_tarifaria: string;
      };
    } = await response.json();

    if (!response.ok || !data.usuario) {
      addToast(
        'error',
        'Erro no cadastro',
        data.erro || 'Não foi possível criar sua conta.'
      );
      return false;
    }

    // Salva o perfil do imóvel no estado do aplicativo.
    setWaterProfile(prof);
    setUser((prev) => ({
      ...prev,
      name: data.usuario!.nome,
      email: data.usuario!.email,
      waterProfile: prof,
    }));

    setIsProfileQuestionsComplete(true);

    addToast(
      'success',
      'Conta criada!',
      'Cadastro realizado. Entrando na sua conta...'
    );

    // Faz login para obter o token necessário à API de consumo.
    const loginOk = await login(email, pass);

    if (!loginOk) {
      addToast(
        'warning',
        'Cadastro concluído',
        'Sua conta foi criada. Faça login para acessar o painel.'
      );
      setScreenState('login');
      return true;
    }

    triggerConfetti();
    return true;
  } catch (error) {
    console.error('Erro no cadastro:', error);

    addToast(
      'error',
      'API indisponível',
      'Não foi possível conectar ao servidor Splash em localhost:3000.'
    );

    return false;
  }
};


  // Projeção proporcional do custo diário usando a estimativa mensal retornada pela API.
  // Não representa uma fatura oficial: as tarifas podem ter parcelas fixas e faixas progressivas.
  const estimatedCostToday = apiConnected && savingsGoal.currentLitersMonthly > 0 && monthlyCost
    ? Number((monthlyCost.total * litersToday / savingsGoal.currentLitersMonthly).toFixed(2))
    : 0;

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        user,
        setUser,
        devices,
        alerts,
        leaks,
        notifications,
        savingsGoal,
        settings,
        updateSettings,
        waterProfile,
        updateWaterProfile,
        getCalculatedBill,
        isProfileQuestionsComplete,
        setIsProfileQuestionsComplete,
        validateAndSaveWaterProfile,
        apiConnected,
        apiError,
        lastMeasurementAt,
        monthlyCost,
        refreshApiData,
        currentFlowLmin,
        litersToday,
        estimatedCostToday,
        isTapOpen,
        toggleTap,
        isSimulatingLeak,
        toggleLeakSimulation,
        isOffline,
        toggleOffline,
        mobileFrameMode,
        setMobileFrameMode,
        toasts,
        addToast,
        removeToast,
        markAlertRead,
        deleteAlert,
        resolveLeak,
        ignoreLeak,
        restartDevice,
        updateDeviceFirmware,
        removeDevice,
        addDevice,
        updateGoal,
        markNotificationRead,
        triggerConfetti,
        hourlyData,
        dailyData,
        monthlyData,
        yearlyData,
        isLoggedIn,
        login,
        logout,
        register,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
