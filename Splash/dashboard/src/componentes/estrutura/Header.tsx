
import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { ArtemLogo } from '../comuns/ArtemLogo';

interface HeaderProps {
  onOpenSidebar: () => void;
}

// Cabeçalho principal do aplicativo
export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const {
    screen,
    setScreen,
    settings,
    updateSettings,
    addToast
  } = useApp();

  const isDarkMode = settings.theme === 'dark';

  // Alterna entre o modo claro e o modo escuro
  const handleToggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';

    updateSettings({ theme: nextTheme });

    addToast(
      'info',
      nextTheme === 'light' ? 'Modo Claro Ativado' : 'Modo Escuro Ativado',
      nextTheme === 'light'
        ? 'Interface branca suave e confortável.'
        : 'Interface escura configurada.'
    );
  };

  // Oculta o cabeçalho nas telas iniciais
  if (['splash', 'onboarding', 'login', 'register'].includes(screen)) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-30 px-3 sm:px-6 py-3 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-300 w-full ${
        isDarkMode
          ? 'border-zinc-800/80 bg-[#141416]/95 text-white'
          : 'border-slate-200 bg-white/95 text-slate-900'
      }`}
    >
      {/* Botão de Menu Lateral e Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title="Abrir Menu Principal"
          aria-label="Abrir Menu Principal"
          id="btn-open-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setScreen('dashboard')}
          className="cursor-pointer group flex items-center"
          title="Ir para Dashboard"
          aria-label="Ir para a Tela Inicial"
          id="btn-header-logo"
        >
          <ArtemLogo
            size="md"
            theme={isDarkMode ? 'dark' : 'light'}
            className="group-hover:opacity-90 transition-opacity"
          />
        </div>
      </div>

      {/* Alternador de tema */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title={isDarkMode ? 'Ativar Modo Claro (Branco)' : 'Ativar Modo Escuro'}
          aria-label="Alternar tema de cores"
          id="btn-toggle-theme"
        >
          {isDarkMode ? (
            <Sun className="w-4.5 h-4.5 text-amber-300" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-[#2ba6e2]" />
          )}
        </button>
      </div>
    </header>
  );
};
