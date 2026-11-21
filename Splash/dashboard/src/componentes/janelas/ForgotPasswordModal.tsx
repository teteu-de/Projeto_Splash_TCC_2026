import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('error', 'E-mail Inválido', 'Por favor insira um endereço de e-mail válido.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      addToast('success', 'Link Enviado!', `Enviamos as instruções de redefinição para ${email}`);
    }, 1500);
  };

  const handleReset = () => {
    setEmail('');
    setIsSent(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#1e1e1e] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="font-bold text-base text-white">Recuperar Senha</h3>
              <button
                onClick={handleReset}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                id="btn-close-forgot-password"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSent ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Verifique seu E-mail</h4>
                  <p className="text-xs text-zinc-400">
                    Enviamos um link seguro para <span className="text-[#99d6ee]">{email}</span> com as instruções de recuperação.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl bg-[#015486] text-white font-semibold text-xs hover:bg-[#2ba6e2] transition-colors"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Digite seu e-mail cadastrado no Splash para receber o link de redefinição de senha.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white font-bold text-xs shadow-md shadow-[#015486]/30 hover:brightness-110 disabled:opacity-50"
                    id="btn-submit-forgot-password"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Link'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
