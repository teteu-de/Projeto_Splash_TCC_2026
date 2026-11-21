import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  Droplet,
  BarChart3,
  DollarSign,
  Target,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { AppScreen } from '../../tipos';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isOpen, onClose }) => {
  const { screen, setScreen, user, logout, t } = useApp();

  const handleNavigate = (targetScreen: AppScreen) => {
    setScreen(targetScreen);
    onClose();
  };

  const menuGroups: {
    title: string;
    items: { id: AppScreen; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard', label: t('dashboard'), icon: <Home className="w-4 h-4" /> },
        { id: 'consumption', label: t('consumption'), icon: <Droplet className="w-4 h-4" /> },
        { id: 'charts', label: t('charts'), icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'bill', label: t('bill'), icon: <DollarSign className="w-4 h-4" /> },
        { id: 'savings_goal', label: t('savingsGoal'), icon: <Target className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Conta & Ajustes',
      items: [
        { id: 'profile', label: t('profile'), icon: <User className="w-4 h-4" /> },
        { id: 'settings', label: t('settings'), icon: <Settings className="w-4 h-4" /> },
        { id: 'help', label: t('help'), icon: <HelpCircle className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-80 bg-[#181818] border-r border-zinc-800 text-white flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-800/80 bg-gradient-to-br from-[#015486]/40 to-[#181818] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-[#2ba6e2] shadow-md"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{user.name}</h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                id="btn-close-drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    {group.title}
                  </div>

                  {group.items.map((item) => {
                    const isActive = screen === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white shadow-md shadow-[#015486]/30'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                        }`}
                        id={`drawer-item-${item.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#2ba6e2]/20 text-[#99d6ee] border border-[#2ba6e2]/30">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-600'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer / Logout */}
            <div className="p-4 border-t border-zinc-800 bg-[#141414]">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-900/50 hover:border-red-500/60 transition-colors cursor-pointer"
                id="btn-drawer-logout"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
