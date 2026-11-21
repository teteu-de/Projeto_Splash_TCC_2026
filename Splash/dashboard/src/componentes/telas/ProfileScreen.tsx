import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit3,
  Award,
  Flame,
  Droplet,
  Home,
  Gauge,
  CheckCircle2,
  Cpu,
  Wifi,
  Radio,
  X,
  UserRound,
  ShieldCheck,
  Power
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { EditProfileModal } from '../janelas/EditProfileModal';
import { BRAZILIAN_UTILITY_PROVIDERS } from '../../dados/tariffsData';
import { UserWaterProfile } from '../../tipos';

// ============================================================================
// 🌎 LISTA DE ESTADOS BRASILEIROS E CONCESSIONÁRIAS DE SANEAMENTO
// ============================================================================
const BRAZILIAN_STATES_LIST = [
  { uf: 'SP', name: 'São Paulo', provider: 'SABESP' },
  { uf: 'RJ', name: 'Rio de Janeiro', provider: 'CEDAE / Águas do Rio' },
  { uf: 'MG', name: 'Minas Gerais', provider: 'COPASA' },
  { uf: 'BA', name: 'Bahia', provider: 'EMBASA' },
  { uf: 'PR', name: 'Paraná', provider: 'SANEPAR' },
  { uf: 'RS', name: 'Rio Grande do Sul', provider: 'CORSAN' },
  { uf: 'PE', name: 'Pernambuco', provider: 'COMPESA' },
  { uf: 'CE', name: 'Ceará', provider: 'CAGECE' },
  { uf: 'PA', name: 'Pará', provider: 'COSANPA' },
  { uf: 'SC', name: 'Santa Catarina', provider: 'CASAN' },
  { uf: 'GO', name: 'Goiás', provider: 'SANEAGO' },
  { uf: 'MA', name: 'Maranhão', provider: 'CAEMA' },
  { uf: 'AM', name: 'Amazonas', provider: 'Águas de Manaus' },
  { uf: 'ES', name: 'Espírito Santo', provider: 'CESAN' },
  { uf: 'PB', name: 'Paraíba', provider: 'CAGEPA' },
  { uf: 'RN', name: 'Rio Grande do Norte', provider: 'CAERN' },
  { uf: 'MT', name: 'Mato Grosso', provider: 'Águas Cuiabá' },
  { uf: 'AL', name: 'Alagoas', provider: 'CASAL' },
  { uf: 'PI', name: 'Piauí', provider: 'Águas de Teresina' },
  { uf: 'DF', name: 'Distrito Federal', provider: 'CAESB' },
  { uf: 'MS', name: 'Mato Grosso do Sul', provider: 'SANESUL' },
  { uf: 'SE', name: 'Sergipe', provider: 'DESO' },
  { uf: 'RO', name: 'Rondônia', provider: 'CAERD' },
  { uf: 'TO', name: 'Tocantins', provider: 'BRK Ambiental' },
  { uf: 'AC', name: 'Acre', provider: 'SAERB' },
  { uf: 'AP', name: 'Amapá', provider: 'CSA Amapá' },
  { uf: 'RR', name: 'Roraima', provider: 'CAER' }
];

// ============================================================================
// 👤 TELA DE PERFIL DO USUÁRIO & TELEMETRIA DE HARDWARE
// ============================================================================
export const ProfileScreen: React.FC = () => {
  const {
    setScreen,
    user,
    devices,
    currentFlowLmin,
    isOffline,
    toggleOffline,
    waterProfile,
    validateAndSaveWaterProfile,
    addToast
  } = useApp();

  // Controle de abas da tela de Perfil: Geral & Imóvel vs Hardware
  const [activeTab, setActiveTab] = useState<'profile' | 'hardware'>('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPropertyEditorOpen, setIsPropertyEditorOpen] = useState(false);

  // Estados locais do formulário de calibração do imóvel
  const [state, setState] = useState<string>(waterProfile?.state || 'SP');
  const [city, setCity] = useState<string>(waterProfile?.city || 'São Paulo');
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [propertyType, setPropertyType] = useState<UserWaterProfile['propertyType']>(
    waterProfile?.propertyType || 'Residencial'
  );

  const [hasSewageCharge, setHasSewageCharge] = useState<UserWaterProfile['hasSewageCharge']>(
    waterProfile?.hasSewageCharge || 'Sim'
  );

  const [, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Concessionária correspondente ao estado selecionado
  const selectedProvider = BRAZILIAN_UTILITY_PROVIDERS[state] || BRAZILIAN_UTILITY_PROVIDERS['SP'];

  useEffect(() => {
    if (selectedProvider && selectedProvider.cities.length > 0) {
      if (!selectedProvider.cities.includes(city) && !isCustomCity) {
        setCity(selectedProvider.cities[0]);
      }
    }
  }, [state]);

  // Informações de telemetria do nó ESP32
  const mainDevice = devices[0] || {
    id: 'esp32-main-01',
    name: 'ESP32 Hidrômetro Principal',
    model: 'NodeMCU WROOM-32 (38-pin)',
    sensorModel: 'ZJ-S201 Flow Sensor (Hall G1/2")',
    firmware: 'v2.4.1-SplashOS',
    ip: '192.168.1.105',
    macAddress: '24:0A:C4:8B:E2:10',
    wifiSignal: 92,
    wifiRssi: -58,
    uptimeDays: 14,
    status: 'online',
    lastSync: 'Agora mesmo',
    flowRateLmin: 0.0,
    kFactor: 7.5
  };

  const isDeviceConnected = !isOffline && mainDevice.status === 'online';

  // Validação dos 6 campos obrigatórios do imóvel
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!state) errors.state = 'Selecione o Estado (UF).';
    if (!city || city.trim().length < 2) errors.city = 'Informe o nome da Cidade.';
    if (!propertyType) errors.propertyType = 'Selecione o tipo do imóvel.';
    if (!hasSewageCharge) errors.hasSewageCharge = 'Informe sobre a cobrança de esgoto.';
    return errors;
  };

  // Salva os dados do imóvel e atualiza tarifas no contexto global
  const handleSavePropertyData = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      addToast('error', 'Campos Incompletos', 'Preencha todos os campos destacados para salvar.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const profileData: UserWaterProfile = {
        state,
        city: city.trim(),
        propertyType,
        hasSewageCharge,
        hasSocialTariff: waterProfile.hasSocialTariff,
        socialTariffCategory: waterProfile.socialTariffCategory,
      };

      const result = validateAndSaveWaterProfile(profileData);
      if (result.success) {
        setIsPropertyEditorOpen(false);
        addToast('success', 'Configurações Atualizadas', 'Dados do imóvel e tarifas salvos com sucesso.');
      }
    }, 400);
  };

  return (
    <div className="space-y-5 text-white max-w-5xl mx-auto">
      {/* Modal para edição de nome e avatar */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 1: CABEÇALHO DO PERFIL & SELETOR DE ABAS                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            id="btn-back-profile"
            title="Voltar ao Dashboard"
            aria-label="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white">Perfil do Usuário</h2>
            <p className="text-xs text-zinc-400">Dados cadastrais, imóvel e telemetria de hardware</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-2 sm:px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[#2ba6e2] hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          id="btn-open-edit-profile"
          aria-label="Editar Foto e Dados do Perfil"
        >
          <Edit3 className="w-4 h-4" />
          <span>Editar Foto</span>
        </button>
      </div>

      {/* Abas Superiores de Navegação Interna: Geral vs Hardware */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2" role="tablist">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#015486] text-white shadow-lg shadow-[#015486]/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
          id="tab-profile-general"
          role="tab"
          aria-selected={activeTab === 'profile'}
        >
          <Home className="w-4 h-4" />
          <span>Geral & Imóvel</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hardware'
              ? 'bg-[#015486] text-white shadow-lg shadow-[#015486]/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
          id="tab-profile-hardware"
          role="tab"
          aria-selected={activeTab === 'hardware'}
        >
          <Cpu className="w-4 h-4 text-[#2ba6e2]" />
          <span>Hardware & Sensor</span>
          <span className={`w-2 h-2 rounded-full ${isDeviceConnected ? 'bg-emerald-500' : 'bg-zinc-500'}`} aria-hidden="true" />
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 2: ABA 1 - GERAL & IMÓVEL (RESUMO COM BOTÃO EDITAR INFORMAÇÕES)  */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          
      {/* Card de Identidade do Usuário */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#015486] via-[#103a58] to-[#181818] border border-[#2ba6e2]/40 text-center space-y-3 shadow-2xl relative overflow-hidden">

      {/* Foto de perfil ou avatar padrão */}
      {user.avatar ? (
        <img
      src={user.avatar}
      alt={user.name || 'Foto do usuário'}
      className="w-20 h-20 rounded-3xl object-cover border-4 border-[#2ba6e2] mx-auto shadow-xl"
      />
      ) : (
        <div className="w-20 h-20 rounded-3xl border-4 border-[#2ba6e2] mx-auto shadow-xl bg-zinc-800 flex items-center justify-center">
        <UserRound className="w-10 h-10 text-zinc-400" />
        </div>
      )}

  {/* Nome e e-mail */}
  <div>
    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
      {user.name}
    </h3>

    <p className="text-xs text-[#99d6ee] font-medium">
      {user.email}
    </p>
  </div>

</div>


          {/* Card de Configuração do Imóvel & Tarifas (Fechado, com Botão Editar Informações) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#202024] border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-[#015486]/30 text-[#2ba6e2] border border-[#2ba6e2]/30">
                    <Gauge className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Configuração do Imóvel & Tarifas
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Parâmetros de cálculo tarifário e classificação residencial
                </p>
              </div>

              {/* Botão de Ação: Editar Informações */}
              <button
                onClick={() => setIsPropertyEditorOpen(true)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-md"
                id="btn-edit-property-info"
                aria-label="Abrir formulário de edição do imóvel e tarifas"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Informações</span>
              </button>
            </div>

            {/* Resumo dos Dados do Imóvel */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">💧 Localização</span>
                <span className="font-extrabold text-white text-xs sm:text-sm mt-0.5 block truncate">
                  {waterProfile.city}, {waterProfile.state}
                </span>
                <span className="text-[10px] text-[#2ba6e2] block truncate">
                  {selectedProvider?.providerName || 'SABESP'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">🏠 Tipo de Imóvel</span>
                <span className="font-extrabold text-white text-xs sm:text-sm mt-0.5 block truncate">
                  {waterProfile.propertyType || 'Residencial'}
                </span>
                <span className="text-[10px] text-zinc-400 block">Individual</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">🚽 Cobrança de Esgoto</span>
                <span className="font-extrabold text-white text-xs sm:text-sm mt-0.5 block">
                  {waterProfile.hasSewageCharge || 'Sim'}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  {waterProfile.hasSewageCharge === 'Sim' ? '100% da água (dobro)' : 'Água tratada'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">🏷️ Tarifa Social</span>
                <span className="font-extrabold text-white text-xs sm:text-sm mt-0.5 block">
                  {waterProfile.hasSocialTariff || 'Não'}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  {waterProfile.hasSocialTariff === 'Sim' ? 'CadÚnico Ativo' : 'Tarifa Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 3: ABA 2 - HARDWARE & SENSOR (STATUS, VAZÃO E SINAL WI-FI)        */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'hardware' && (
        <div className="space-y-5">
          {/* Card Principal de Telemetria do Hardware */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#202024] border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#015486]/30 text-[#2ba6e2] border border-[#2ba6e2]/30 flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {mainDevice.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">{mainDevice.model}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isDeviceConnected ? 'bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse' : 'bg-zinc-500'
                  }`}
                  aria-hidden="true"
                />
                <span className={`text-xs font-bold ${isDeviceConnected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {isDeviceConnected ? 'ESP32 Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>

            {/* Grid dos 3 Pilares Solicitados: Status, Sensor de Vazão e Sinal Wi-Fi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Status da Conexão */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Status Geral</span>
                  <Radio className="w-4 h-4 text-[#2ba6e2]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-white font-mono">
                    {isDeviceConnected ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <p>IP: <span className="text-zinc-200 font-mono">{mainDevice.ip}</span></p>
                  <p>Uptime: <span className="text-zinc-200">{mainDevice.uptimeDays} dias ativos</span></p>
                </div>
              </div>

              {/* 2. Sensor de Vazão (ZJ-S201) */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Sensor de Vazão</span>
                  <Droplet className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    {currentFlowLmin.toFixed(2)}
                  </span>
                  <span className="text-xs text-cyan-200 font-bold">L/min</span>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <p>Modelo: <span className="text-zinc-200 font-semibold">{mainDevice.sensorModel}</span></p>
                  <p>Fator de Pulsos: <span className="text-zinc-200 font-mono">K = {mainDevice.kFactor}</span></p>
                </div>
              </div>

              {/* 3. Sinal Wi-Fi */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Sinal Wi-Fi</span>
                  <Wifi className="w-4 h-4 text-[#2ba6e2]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono">
                    {mainDevice.wifiSignal}%
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">({mainDevice.wifiRssi} dBm)</span>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <p>Qualidade: <span className="text-emerald-400 font-semibold">Excelente</span></p>
                  <p>SSID: <span className="text-zinc-200 font-mono">Splash_Home_IoT</span></p>
                </div>
              </div>
            </div>

            {/* Ações de Hardware */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 text-xs">
              <button
                onClick={() => toggleOffline()}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Simular {isOffline ? 'Conectar' : 'Desconectar'} Hardware</span>
              </button>

              <button
                onClick={() => addToast('info', 'Calibração Verificada', 'Sensor de efeito Hall ZJ-S201 operando em conformidade com o ESP32.')}
                className="px-4 py-2 rounded-xl bg-[#015486]/40 border border-[#2ba6e2]/40 text-[#99d6ee] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Checar Calibração</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 4: MODAL DE EDIÇÃO DE INFORMAÇÕES DO IMÓVEL (AS 6 PERGUNTAS)     */}
      {/* ---------------------------------------------------------------------- */}
      {isPropertyEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1c1c20] border border-zinc-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar my-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#015486]/40 text-[#2ba6e2]">
                  <Gauge className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-base text-white">Editar Configuração do Imóvel</h3>
              </div>
              <button
                onClick={() => setIsPropertyEditorOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                aria-label="Fechar formulário"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertyData} className="space-y-4">
              {/* 1. Onde você mora */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>💧 1. Onde você mora? (Estado e Cidade)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="bg-[#141416] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                  >
                    {BRAZILIAN_STATES_LIST.map((s) => (
                      <option key={s.uf} value={s.uf}>
                        {s.uf} - {s.name} ({s.provider})
                      </option>
                    ))}
                  </select>

                  {isCustomCity ? (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Nome da cidade"
                      className="bg-[#141416] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                    />
                  ) : (
                    <select
                      value={city}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCity(true);
                          setCity('');
                        } else {
                          setCity(e.target.value);
                        }
                      }}
                      className="bg-[#141416] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                    >
                      {(selectedProvider?.cities || ['São Paulo']).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__custom__">Outra cidade (digitar)...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* 2. Tipo de imóvel */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white">
                  🏠 2. Qual é o tipo de imóvel?
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full bg-[#141416] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                >
                  <option value="Residencial">Residencial (Casa padrão / Sobrado)</option>
                  <option value="Residencial">Residencial (Apartamento / Condomínio)</option>
                  <option value="Comercial">Comercial (Escritório, Loja, Comércio)</option>
                  <option value="Outro">Outro (Chácara, Sítio, Galpão)</option>
                </select>
              </div>

              {/* 5. Cobrança de esgoto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white">
                  🚽 5. Sua conta possui cobrança de esgoto?
                </label>
                <select
                  value={hasSewageCharge}
                  onChange={(e) => setHasSewageCharge(e.target.value as any)}
                  className="w-full bg-[#141416] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
                >
                  <option value="Sim">Sim (100% da água - cobrança em dobro)</option>
                  <option value="Não">Não (Apenas água tratada - sem esgoto)</option>
                  <option value="Não sei">Não sei (Aplicar regra da concessionária)</option>
                </select>
              </div>

              {/* Botões de Ação do Modal */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsPropertyEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  id="btn-save-property-modal"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
