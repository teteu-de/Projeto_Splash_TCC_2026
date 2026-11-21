import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { ForgotPasswordModal } from '../janelas/ForgotPasswordModal';
import { SplashLogo } from '../comuns/SplashLogo';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const { login, setScreen, addToast } = useApp();

 
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    setIsLoading(true);
    addToast('info', 'Autenticando com Google...', 'Conectando à sua conta Google Workspace.');
    setTimeout(() => {
      setIsLoading(false);
      login('gabriel.vissotto@gmail.com', 'google_oauth_token');
    }, 500);
  };

  return (
    <div className="min-h-full h-full flex flex-col justify-between p-6 bg-[#181818] text-white overflow-y-auto">
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />

      {/* Header Central Logo (Splash ESTD 2026) */}
      <div className="flex flex-col items-center text-center pt-2">
        <SplashLogo size="md" showSubtitle={true} className="mb-2" />
        <p className="text-xs text-zinc-400">Acesse sua conta para monitorar seu consumo de água</p>
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4 my-auto py-6">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2] transition-colors"
              id="input-login-email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2] transition-colors"
              id="input-login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
              id="btn-toggle-show-password"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Login & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-300 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[#2ba6e2] focus:ring-0"
            />
            <span>Lembrar login</span>
          </label>

          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
            className="text-[#99d6ee] hover:underline font-semibold text-xs"
            id="btn-forgot-password"
          >
            Esqueci minha senha
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#015486] via-[#2ba6e2] to-[#2ba6e2] text-white font-bold text-sm shadow-lg shadow-[#015486]/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          id="btn-submit-login"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Entrar no Sistema</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-[#181818] px-3 text-[11px] text-zinc-500 font-medium absolute">ou</span>
        </div>

        {/* Google OAuth Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
          id="btn-google-login"
        >
          <Chrome className="w-4 h-4 text-emerald-400" />
          <span>Entrar com Google</span>
        </button>
      </form>

      {/* Footer Register Link */}
      <div className="text-center pt-2 pb-2 border-t border-zinc-800/80">
        <p className="text-xs text-zinc-400">
          Ainda não tem uma conta?{' '}
          <button
            onClick={() => setScreen('register')}
            className="text-[#2ba6e2] font-bold hover:underline cursor-pointer"
            id="btn-nav-to-register"
          >
            Criar Conta
          </button>
        </p>
      </div>
    </div>
  );
};
