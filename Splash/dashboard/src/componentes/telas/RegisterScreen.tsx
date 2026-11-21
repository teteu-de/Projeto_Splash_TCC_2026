
import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

import { useApp } from '../../contexto/AppContext';
import {
  BRAZILIAN_UTILITY_PROVIDERS,
  defaultUserWaterProfile
} from '../../dados/tariffsData';
import { UserWaterProfile } from '../../tipos';
import { SplashLogo } from '../comuns/SplashLogo';

export const RegisterScreen: React.FC = () => {
  // Dados da conta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dados do imóvel
  const [state, setState] = useState('SP');
  const [city, setCity] = useState('São Paulo');
  const [propertyType, setPropertyType] = useState<
    'Residencial' | 'Comercial' | 'Outro'
  >('Residencial');

  const [hasSewageCharge, setHasSewageCharge] =
    useState<'Sim' | 'Não' | 'Não sei'>('Sim');

  // Tarifa Social
  const [hasSocialTariff, setHasSocialTariff] =
    useState<'Sim' | 'Não' | 'Não sei'>('Não');

  const [socialTariffCategory, setSocialTariffCategory] =
    useState<'vulneravel' | 'social' | 'social2'>('social');

  // Controle das etapas
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { register, setScreen, addToast } = useApp();

  const selectedProvider =
    BRAZILIAN_UTILITY_PROVIDERS[state] ||
    BRAZILIAN_UTILITY_PROVIDERS['SP'];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('error', 'Nome Obrigatório', 'Informe seu nome completo.');
      return;
    }

    if (!email.includes('@')) {
      addToast('error', 'E-mail Inválido', 'Insira um endereço de e-mail válido.');
      return;
    }

    if (password !== confirmPassword) {
      addToast('error', 'Senhas Diferentes', 'A confirmação de senha não coincide.');
      return;
    }

    if (password.length < 8) {
      addToast('error', 'Senha Fraca', 'A senha deve conter no mínimo 8 caracteres.');
      return;
    }

    setStep(2);
  };

  const handleStateChange = (newUf: string) => {
    setState(newUf);

    const provider =
      BRAZILIAN_UTILITY_PROVIDERS[newUf] ||
      BRAZILIAN_UTILITY_PROVIDERS['SP'];

    setCity(provider.cities[0] || '');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      addToast(
        'error',
        'Cidade Obrigatória',
        'Por favor, informe a cidade do imóvel.'
      );
      return;
    }

    const waterProfile: UserWaterProfile = {
      ...defaultUserWaterProfile,
      state,
      city: city.trim(),
      propertyType,
      hasSewageCharge,
      hasSocialTariff,
      socialTariffCategory:
        hasSocialTariff === 'Sim'
          ? socialTariffCategory
          : 'residencial',
    };

    setIsLoading(true);

    try {
      const sucesso = await register(
        name,
        email,
        password,
        waterProfile
      );

      if (sucesso) {
        setScreen('dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full h-full flex flex-col justify-between p-6 bg-[#181818] text-white overflow-y-auto">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => step === 2 ? setStep(1) : setScreen('login')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 2 ? 'Voltar' : 'Voltar ao Login'}</span>
        </button>
      </div>

      <div className="text-center space-y-1.5 py-3">
        <SplashLogo
          size="sm"
          showSubtitle={false}
          className="mx-auto mb-1 w-16"
        />

        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Criar sua Conta Splash
        </h2>

        <p className="text-xs text-zinc-400">
          {step === 1
            ? 'Etapa 1 de 2: Dados da conta'
            : 'Etapa 2 de 2: Dados do imóvel'}
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={step === 1 ? handleNextStep : handleFinalSubmit}
        className="space-y-3.5 my-auto"
      >

        {step === 1 && (
          <>
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Nome Completo
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                E-mail
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Senha
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
                />
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Confirmar Senha
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Estado */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Estado
              </label>

              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-white"
              >
                {Object.keys(BRAZILIAN_UTILITY_PROVIDERS).map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Cidade
              </label>

              <input
                type="text"
                list="cidades-disponiveis"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Informe sua cidade"
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-white"
              />

              <datalist id="cidades-disponiveis">
                {selectedProvider.cities.map((cidade: string) => (
                  <option key={cidade} value={cidade} />
                ))}
              </datalist>
            </div>

            {/* Tipo de imóvel */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Tipo de imóvel
              </label>

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-white"
              >
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Cobrança de esgoto */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Possui cobrança de esgoto?
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['Sim', 'Não', 'Não sei'] as const).map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => setHasSewageCharge(opcao)}
                    className={`py-2.5 rounded-xl border text-xs font-bold ${
                      hasSewageCharge === opcao
                        ? 'bg-[#015486] border-[#2ba6e2] text-white'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarifa Social */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  🏷️ Você possui Tarifa Social?
                </label>

                <p className="text-[10px] text-zinc-500 mt-1">
                  Selecione a opção indicada na sua conta de água.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(['Sim', 'Não'] as const).map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => setHasSocialTariff(opcao)}
                    className={`py-2.5 rounded-xl border text-xs font-bold ${
                      hasSocialTariff === opcao
                        ? 'bg-[#015486] border-[#2ba6e2] text-white'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>

              {hasSocialTariff === 'Sim' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-400">
                    Qual é a sua categoria de Tarifa Social?
                  </label>

                  {([
                    { value: 'vulneravel', label: 'Vulnerável' },
                    { value: 'social', label: 'Social I' },
                    { value: 'social2', label: 'Social II' },
                  ] as const).map((categoria) => (
                    <button
                      key={categoria.value}
                      type="button"
                      onClick={() => setSocialTariffCategory(categoria.value)}
                      className={`w-full py-2.5 rounded-xl border text-xs font-bold ${
                        socialTariffCategory === categoria.value
                          ? 'bg-[#015486] border-[#2ba6e2] text-white'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {socialTariffCategory === categoria.value ? '✓ ' : ''}
                      {categoria.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Botão principal */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#015486] via-[#2ba6e2] to-[#2ba6e2] text-white font-bold text-sm shadow-lg shadow-[#015486]/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Aguarde...</span>
          ) : step === 1 ? (
            <>
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <span>Criar Conta</span>
          )}
        </button>
      </form>

      {/* Rodapé */}
      <div className="text-center pt-2 border-t border-zinc-800/80 mt-5">
        <p className="text-xs text-zinc-400">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => setScreen('login')}
            className="text-[#2ba6e2] font-bold hover:underline"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
}; 
