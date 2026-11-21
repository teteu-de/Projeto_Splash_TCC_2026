import React, { useState } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  User,
  HelpCircle,
  FileText,
  Lock,
  Info,
  ChevronRight,
  Check,
  CheckCircle2,
  Droplets,
  Building
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { Language } from '../../tipos';
import { EditProfileModal } from '../janelas/EditProfileModal';
import { ForgotPasswordModal } from '../janelas/ForgotPasswordModal';
import { AboutTccModal } from '../janelas/AboutTccModal';
import { BRAZILIAN_UTILITY_PROVIDERS } from '../../dados/tariffsData';

export const SettingsScreen: React.FC = () => {
  const { setScreen, settings, updateSettings, waterProfile, updateWaterProfile, t, addToast } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAboutTccOpen, setIsAboutTccOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState<string | null>(null);

  // Water Profile in Settings
  const [isEditingWaterProfile, setIsEditingWaterProfile] = useState(false);
  const [wpState, setWpState] = useState(waterProfile.state || 'SP');
  const [wpCity, setWpCity] = useState(waterProfile.city || 'São Paulo');
  const [wpPropertyType, setWpPropertyType] = useState(waterProfile.propertyType || 'Residencial');
  const [wpSewage, setWpSewage] = useState(waterProfile.hasSewageCharge || 'Sim');

  const isDarkMode = settings.theme === 'dark';
  const selectedProvider = BRAZILIAN_UTILITY_PROVIDERS[wpState] || BRAZILIAN_UTILITY_PROVIDERS['SP'];

  const handleStateChange = (newUf: string) => {
    setWpState(newUf);
    const prov = BRAZILIAN_UTILITY_PROVIDERS[newUf] || BRAZILIAN_UTILITY_PROVIDERS['SP'];
    setWpCity(prov.cities[0] || '');
  };

  const handleSaveWaterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateWaterProfile({
      state: wpState,
      city: wpCity,
      propertyType: wpPropertyType as any,
      hasSewageCharge: wpSewage as any,
    });
    setIsEditingWaterProfile(false);
    addToast('success', 'Tarifas Salvas', 'Dados do imóvel e concessionária atualizados com sucesso.');
  };

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <ForgotPasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <AboutTccModal isOpen={isAboutTccOpen} onClose={() => setIsAboutTccOpen(false)} />

      {/* Terms / Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-zinc-800 rounded-3xl p-6 text-white space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-base text-white">
              {showTermsModal === 'terms' ? 'Termos de Uso Splash' : 'Política de Privacidade'}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              O aplicativo Splash foi desenvolvido como Trabalho de Conclusão de Curso (TCC) para o curso Técnico em Informática. Os dados coletados pelo sensor ESP32 são armazenados exclusivamente para fins de monitoramento e auxílio no consumo consciente de água.
            </p>
            <button
              onClick={() => setShowTermsModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#015486] text-white font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="btn-back-settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-white">{t('settings')}</h2>
          <p className="text-xs text-zinc-400">Preferências, tema e segurança da conta</p>
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
          Conta & Segurança
        </h3>
        <div className="p-2 rounded-3xl bg-[#242424] border border-zinc-800 space-y-1">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
            id="btn-settings-edit-profile"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#2ba6e2]" />
              <span>Editar Perfil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
            id="btn-settings-change-password"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Trocar / Alterar Senha</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Regras Tarifárias & Imóvel (6 Perguntas Obrigatórias) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Perfil do Imóvel & Tarifas
          </h3>
          <span className="text-[10px] font-mono text-[#99d6ee] font-bold">
            {selectedProvider.providerName} ({wpState})
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#015486]/30 text-[#2ba6e2] flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Regras Regionais de Saneamento</h4>
                <p className="text-[10px] text-zinc-400">
                   {wpCity} - {wpState} • {wpPropertyType}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingWaterProfile(!isEditingWaterProfile)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#99d6ee] text-xs font-semibold transition-colors"
              id="btn-toggle-edit-water-profile"
            >
              {isEditingWaterProfile ? 'Fechar' : 'Alterar'}
            </button>
          </div>

          {isEditingWaterProfile ? (
            <form onSubmit={handleSaveWaterProfile} className="space-y-3 pt-2 border-t border-zinc-800">
              {/* 1. Onde você mora? */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  💧 1. Onde você mora? (Identifica a tarifa/regra)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={wpState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    {Object.keys(BRAZILIAN_UTILITY_PROVIDERS).map((uf) => (
                      <option key={uf} value={uf}>
                        {uf} - {BRAZILIAN_UTILITY_PROVIDERS[uf].providerName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={wpCity}
                    onChange={(e) => setWpCity(e.target.value)}
                    placeholder="Cidade"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* 2. Qual é o tipo de imóvel? */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  🏠 2. Qual é o tipo de imóvel?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Residencial', 'Comercial', 'Outro'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setWpPropertyType(t as any)}
                      className={`py-1.5 rounded-xl text-xs font-semibold border ${
                        wpPropertyType === t
                          ? 'bg-[#015486] border-[#2ba6e2] text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cobrança de esgoto? */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  🚽 3. Sua conta possui cobrança de esgoto?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sim', 'Não', 'Não sei'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setWpSewage(opt as any)}
                      className={`py-1.5 rounded-xl text-xs font-semibold border ${
                        wpSewage === opt
                          ? 'bg-[#015486] border-[#2ba6e2] text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                id="btn-save-settings-water-profile"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações de Tarifas</span>
              </button>
            </form>
          ) : (
            <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase">Concessionária</span>
                <span className="font-bold text-white">{selectedProvider.providerName} ({wpState})</span>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase">Cobrança de Esgoto</span>
                <span className="font-bold text-emerald-400">{wpSewage} (duplica o valor)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appearance & Language (Tema Claro / Branco e Escuro com regras de UI) */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Tema da Interface & Conforto Visual
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Escolha entre o visual claro (branco suave) ou escuro de acordo com sua preferência
          </p>
        </div>

        {/* Visual Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card Modo Claro (Branco & Clean) */}
          <div
            onClick={() => {
              updateSettings({ theme: 'light' });
              addToast('info', 'Modo Claro Ativado', 'Interface branca e suave configurada com conforto visual.');
            }}
            className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              !isDarkMode
                ? 'border-[#0284c7] bg-white text-slate-900 shadow-lg shadow-sky-950/10 ring-2 ring-[#0284c7]/20'
                : 'border-zinc-800 bg-[#202024] text-white hover:border-zinc-700'
            }`}
            id="btn-select-light-theme"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Modo Claro (Branco)</h4>
                  <span className="text-[10px] text-zinc-400">Design Clean & Arejado</span>
                </div>
              </div>

              {!isDarkMode && (
                <span className="p-1 rounded-full bg-emerald-500 text-white">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Preview Mini Box */}
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Fundo Off-White (#f8fafc)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">WCAG AA</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Cartões brancos com sombras sutis para não ofuscar a visão em ambientes claros.
              </p>
            </div>
          </div>

          {/* Card Modo Escuro (Dark & Deep) */}
          <div
            onClick={() => {
              updateSettings({ theme: 'dark' });
              addToast('info', 'Modo Escuro Ativado', 'Interface escura configurada.');
            }}
            className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              isDarkMode
                ? 'border-[#2ba6e2] bg-[#222228] text-white shadow-lg shadow-[#015486]/30 ring-2 ring-[#2ba6e2]/20'
                : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
            }`}
            id="btn-select-dark-theme"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#015486]/30 text-[#2ba6e2] flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Modo Escuro</h4>
                  <span className="text-[10px] text-zinc-400">Dark Mode Imersivo</span>
                </div>
              </div>

              {isDarkMode && (
                <span className="p-1 rounded-full bg-[#2ba6e2] text-white">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Preview Mini Box */}
            <div className="p-2.5 rounded-xl bg-[#161619] border border-zinc-800 text-zinc-300 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Fundo Deep Dark (#101012)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">OLED Friendly</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Reduz o cansaço dos olhos durante a noite e economiza bateria da tela.
              </p>
            </div>
          </div>
        </div>

        {/* Box com Regras de UI e Conforto Visual */}
        <div className="p-3.5 rounded-2xl bg-[#202024] border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2ba6e2] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="font-bold text-white text-xs">Padrão Ergonômico de Design Splash</h5>
            <p className="text-[11px] leading-relaxed">
              O modo branco adota a paleta <strong>Off-White confortável</strong> (evitando o branco 100% que agride os olhos), com proporção de contraste &ge; 4.5:1 para garantir leitura agradável dos gráficos e números.
            </p>
          </div>
        </div>
      </div>

      {/* Information & Legal */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
          Sobre & Suporte
        </h3>
        <div className="p-2 rounded-3xl bg-[#242424] border border-zinc-800 space-y-1">
          <button
            onClick={() => setScreen('help')}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#99d6ee]" />
              <span>{t('help')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => setIsAboutTccOpen(true)}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
            id="btn-open-about-tcc"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#2ba6e2]" />
              <span>Sobre o Projeto Splash</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => setShowTermsModal('terms')}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>Termos de Uso</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => setShowTermsModal('privacy')}
            className="w-full p-3 rounded-2xl hover:bg-zinc-800/80 flex items-center justify-between text-xs text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Política de Privacidade</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
