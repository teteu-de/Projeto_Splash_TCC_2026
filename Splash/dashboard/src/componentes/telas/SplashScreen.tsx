import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { SplashLogo } from '../comuns/SplashLogo';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div
      onClick={() => setScreen('login')}
      className="min-h-full h-full flex flex-col items-center justify-between p-8 bg-[#181818] text-white select-none cursor-pointer"
    >
      <div className="w-full flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScreen('login');
          }}
          className="text-xs text-[#2ba6e2] font-semibold hover:underline"
        >
          Ir para Login →
        </button>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#99d6ee]/60 border border-[#99d6ee]/20 px-2.5 py-1 rounded-full">
          Hidrômetro IoT
        </span>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 my-auto">
        {/* Animated Second Logo (Splash ESTD 2026) */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 140, delay: 0.2 }}
          className="relative"
        >
          <SplashLogo size="lg" showSubtitle={true} />
        </motion.div>

        {/* Specs Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400"
        >
          <Cpu className="w-3.5 h-3.5 text-[#2ba6e2]" />
          <span>Monitoramento Inteligente • ESP32</span>
        </motion.div>
      </div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-xs space-y-3 text-center"
      >
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#015486] via-[#2ba6e2] to-[#99d6ee] rounded-full"
          />
        </div>
        <p className="text-[11px] text-zinc-500 font-medium">Iniciando sistema e calibrando sensor...</p>
      </motion.div>
    </div>
  );
};
