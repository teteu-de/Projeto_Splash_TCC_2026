import React from 'react';
import { Home, Droplet, User } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { AppScreen } from '../../tipos';

// ============================================================================
// 📱 NAVEGAÇÃO INFERIOR PRINCIPAL (BottomNav)
// ============================================================================
// Contém exclusivamente as 3 abas essenciais do aplicativo Splash:
// 1. Início (Dashboard)
// 2. Consumo (Gráficos, Meta Mensal e Média Diária)
// 3. Perfil (Dados do Imóvel, Tarifas e Telemetria de Hardware)
export const BottomNav: React.FC = () => {
  const { screen, setScreen, t } = useApp();

  // Não renderiza a navegação nas telas iniciais de autenticação
  if (['splash', 'onboarding', 'login', 'register'].includes(screen)) {
    return null;
  }

  // Lista de abas principais com seus respectivos identificadores, rótulos e ícones
  const navItems: { id: AppScreen; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'consumption',
      label: t('consumption'),
      icon: <Droplet className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#161618]/95 backdrop-blur-lg border-t border-zinc-800/80 px-4 py-2 w-full max-w-lg mx-auto md:rounded-t-2xl md:bottom-2 md:shadow-2xl"
      aria-label="Navegação Principal do Aplicativo"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-6 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#2ba6e2] font-semibold bg-[#015486]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
              id={`nav-item-${item.id}`}
              aria-label={`Ir para a aba ${item.label}`}
            >
              <div className="relative">
                {item.icon}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#2ba6e2] mt-1 shadow-sm shadow-[#2ba6e2]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
