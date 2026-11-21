import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Lock, Camera, Check } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, addToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [password, setPassword] = useState('');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      avatar
    }));
    addToast('success', 'Perfil Atualizado!', 'Suas alterações foram salvas com sucesso.');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#1e1e1e] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-white">Editar Perfil</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                id="btn-close-edit-profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Selection */}
            <div className="text-center space-y-2">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-full h-full rounded-3xl object-cover border-2 border-[#2ba6e2] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-[#015486] text-white border border-[#2ba6e2]">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">Escolha uma foto de perfil:</p>
              <div className="flex justify-center gap-2">
                {sampleAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Sample avatar"
                    onClick={() => setAvatar(url)}
                    className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-transform hover:scale-105 ${
                      avatar === url ? 'border-[#2ba6e2]' : 'border-transparent opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 uppercase font-bold">Nome</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 uppercase font-bold">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                  />
                </div>
              </div>

              {/* Optional Password update */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 uppercase font-bold">Nova Senha (Opcional)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Deixe em branco para manter"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2ba6e2] text-white font-bold text-xs hover:brightness-110 flex items-center justify-center gap-1.5"
                  id="btn-save-edit-profile"
                >
                  <Check className="w-4 h-4" /> Salvar Perfil
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
