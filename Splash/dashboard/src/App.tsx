import React from 'react';
import { AppProvider, useApp } from './contexto/AppContext';
import { MobileShell } from './componentes/estrutura/MobileShell';

// ============================================================================
// 📱 IMPORTAÇÃO DE TELAS (Screens)
// ============================================================================
// 1. Telas Iniciais & Autenticação
import { SplashScreen } from './componentes/telas/SplashScreen';
import { OnboardingScreen } from './componentes/telas/OnboardingScreen';
import { LoginScreen } from './componentes/telas/LoginScreen';
import { RegisterScreen } from './componentes/telas/RegisterScreen';

// 2. Telas Principais do Usuário (Abas de Navegação)
import { DashboardScreen } from './componentes/telas/DashboardScreen';
import { ConsumptionDetailScreen } from './componentes/telas/ConsumptionDetailScreen';
import { ProfileScreen } from './componentes/telas/ProfileScreen';

// 3. Telas Financeiras & Metas de Economia
import { BillFinancialScreen } from './componentes/telas/BillFinancialScreen';
import { SavingsGoalScreen } from './componentes/telas/SavingsGoalScreen';
import { ChartsDetailScreen } from './componentes/telas/ChartsDetailScreen';

// 4. Telas de Alertas & Telemetria IoT
import { AlertsCenterScreen } from './componentes/telas/AlertsCenterScreen';
import { LeaksScreen } from './componentes/telas/LeaksScreen';
import { DevicesScreen } from './componentes/telas/DevicesScreen';

// 5. Telas de Relatórios, Configurações & Suporte
import { HistoryScreen } from './componentes/telas/HistoryScreen';
import { StatisticsScreen } from './componentes/telas/StatisticsScreen';
import { NotificationsScreen } from './componentes/telas/NotificationsScreen';
import { SettingsScreen } from './componentes/telas/SettingsScreen';
import { HelpScreen } from './componentes/telas/HelpScreen';

// ============================================================================
// 🧭 ROTEADOR PRINCIPAL DE TELAS
// ============================================================================
const MainScreenRouter: React.FC = () => {
  const { screen } = useApp();

  switch (screen) {
    // Autenticação
    case 'splash':
      return <SplashScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'login':
      return <LoginScreen />;
    case 'register':
      return <RegisterScreen />;

    // Telas Centrais
    case 'dashboard':
      return <DashboardScreen />;
    case 'consumption':
      return <ConsumptionDetailScreen />;
    case 'profile':
      return <ProfileScreen />;

    // Financeiro e Metas
    case 'bill':
      return <BillFinancialScreen />;
    case 'savings_goal':
      return <SavingsGoalScreen />;
    case 'charts':
      return <ChartsDetailScreen />;

    // Segurança & Notificações
    case 'alerts':
      return <AlertsCenterScreen />;
    case 'leaks':
      return <LeaksScreen />;
    case 'devices':
      return <DevicesScreen />;
    case 'notifications':
      return <NotificationsScreen />;

    // Histórico & Configurações
    case 'history':
      return <HistoryScreen />;
    case 'statistics':
      return <StatisticsScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'help':
      return <HelpScreen />;

    // Fallback padrão
    default:
      return <DashboardScreen />;
  }
};

// ============================================================================
// 🚀 ENTRADA PRINCIPAL DA APLICAÇÃO
// ============================================================================
export default function App() {
  return (
    <AppProvider>
      <MobileShell>
        <MainScreenRouter />
      </MobileShell>
    </AppProvider>
  );
}
