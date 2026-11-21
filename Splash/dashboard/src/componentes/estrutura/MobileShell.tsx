import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SidebarDrawer } from './SidebarDrawer';
import { ToastContainer } from '../comuns/ToastContainer';
import { useApp } from '../../contexto/AppContext';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, screen } = useApp();

  const isDarkMode = settings.theme === 'dark';

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col ${
        isDarkMode ? 'bg-[#101010] text-zinc-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <ToastContainer />

      {/* Fully Responsive Web Layout: Mobile, Tablet & Desktop */}
      <div className="w-full flex-1 flex flex-col max-w-7xl mx-auto shadow-2xl relative min-h-screen">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-28 custom-scrollbar relative px-2 sm:px-4 md:px-6 py-3">
          {children}
        </main>

        <BottomNav />

        <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </div>
  );
};
