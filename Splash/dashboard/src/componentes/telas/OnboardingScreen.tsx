import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, TrendingDown, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { SplashLogo } from '../comuns/SplashLogo';

export const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setScreen } = useApp();

  const slides = [
    {
      id: 0,
      title: 'Monitoramento Inteligente',
      subtitle: 'Conexão direta com ESP32',
      description:
        'Acompanhe a vazão de água da sua residência em tempo real com leitura precisa de pulsos via sensor Hall ZJ-S201.',
      icon: <Activity className="w-16 h-16 text-[#2ba6e2]" />,
      badge: 'Tempo Real'
    },
    {
      id: 1,
      title: 'Economia de Água & Dinheiro',
      subtitle: 'Conversão em Reais (R$)',
      description:
        'Defina metas mensais de consumo, visualize comparativos históricos e saiba exatamente o valor estimado da sua conta antes dela chegar.',
      icon: <TrendingDown className="w-16 h-16 text-[#99d6ee]" />,
      badge: 'Financeiro'
    },
    {
      id: 2,
      title: 'Detecção de Vazamentos',
      subtitle: 'Alertas automáticos 24h',
      description:
        'Receba notificações instantâneas ao menor sinal de fluxo contínuo ou gotejamento indevido, evitando prejuízos financeiros.',
      icon: <ShieldAlert className="w-16 h-16 text-red-400" />,
      badge: 'Segurança'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setScreen('login');
    }
  };

  return (
    <div className="min-h-full h-full flex flex-col justify-between p-6 bg-[#181818] text-white">
      {/* Top Header Controls: Second Logo at the top */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <SplashLogo size="sm" showSubtitle={false} className="w-14" />
        </div>
        <button
          onClick={() => setScreen('login')}
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-zinc-800"
          id="btn-skip-onboarding"
        >
          Pular
        </button>
      </div>

      {/* Main Animated Slide Content */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Slide Graphic */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#015486]/40 via-[#181818] to-zinc-900 border border-[#2ba6e2]/30 flex items-center justify-center shadow-xl shadow-[#2ba6e2]/10">
                {slides[currentSlide].icon}
              </div>
              <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-[#015486] text-[#99d6ee] text-[10px] font-bold border border-[#2ba6e2]/40">
                {slides[currentSlide].badge}
              </span>
            </div>

            {/* Slide Titles */}
            <div className="space-y-2 max-w-xs">
              <span className="text-xs font-bold text-[#2ba6e2] uppercase tracking-wider">
                {slides[currentSlide].subtitle}
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal pt-1">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation & Dots */}
      <div className="space-y-6">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#2ba6e2]' : 'w-2 bg-zinc-700'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#015486] via-[#2ba6e2] to-[#2ba6e2] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#015486]/40 hover:brightness-110 active:scale-[0.99] transition-all"
          id="btn-onboarding-continue"
        >
          <span>{currentSlide === slides.length - 1 ? 'Começar Agora' : 'Continuar'}</span>
          {currentSlide === slides.length - 1 ? (
            <Check className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
