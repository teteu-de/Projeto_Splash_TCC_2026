import React, { useState } from 'react';
import {
  ArrowLeft,
  Cpu,
  Wifi,
  Plus,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Info,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { DeviceInfo } from '../../tipos';
import { DeviceDetailModal } from '../janelas/DeviceDetailModal';

export const DevicesScreen: React.FC = () => {
  const { setScreen, devices, addDevice, removeDevice, addToast, isOffline } = useApp();
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevIp, setNewDevIp] = useState('');

  // Regra solicitada: Permitir apenas 1 dispositivo conectado
  const hasConnectedDevice = devices.length >= 1;
  const currentDevice = devices[0];

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasConnectedDevice) {
      addToast('error', 'Limite Atingido', 'O sistema permite apenas 1 dispositivo ESP32 conectado.');
      return;
    }
    if (!newDevName) {
      addToast('error', 'Nome Obrigatório', 'Insira um nome para o ESP32.');
      return;
    }
    addDevice({
      name: newDevName,
      ip: newDevIp || '192.168.1.105',
      model: 'ESP32 NodeMCU WROOM-32',
      sensorModel: 'ZJ-S201 Flow Sensor G1/2"'
    });
    setNewDevName('');
    setNewDevIp('');
    setIsAddingNew(false);
    addToast('success', 'ESP32 Pareado', 'Dispositivo único registrado com sucesso.');
  };

  return (
    <div className="space-y-5 text-white max-w-4xl mx-auto">
      <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            id="btn-back-devices"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white">Dispositivo Conectado</h2>
            <p className="text-xs text-zinc-400">Gerenciamento do hidrômetro inteligente (1 dispositivo)</p>
          </div>
        </div>

        {/* Adicionar permitido apenas se não houver dispositivo */}
        {!hasConnectedDevice && (
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="p-2 px-3 rounded-xl bg-[#015486] text-white hover:bg-[#2ba6e2] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            id="btn-add-device-toggle"
          >
            <Plus className="w-4 h-4" />
            <span>Conectar ESP32</span>
          </button>
        )}
      </div>

      {/* Banner Informativo de Conexão Única */}
      <div className="p-4 rounded-3xl bg-[#202024] border border-zinc-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2ba6e2] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white">Conexão Exclusiva (1 Dispositivo)</h4>
          <p className="text-zinc-400 leading-relaxed font-sans">
            Para garantir máxima precisão no cálculo de vazão e evitar interferências, este sistema conecta apenas <strong>1 nó ESP32</strong> por residência.
          </p>
        </div>
      </div>

      {/* Atalho Especial Solicitado: Acessar Hardware pelo Perfil */}
      <div
        onClick={() => setScreen('profile')}
        className="p-4 rounded-3xl bg-gradient-to-r from-[#015486]/40 via-[#103a58]/40 to-[#202024] border border-[#2ba6e2]/40 hover:border-[#2ba6e2] transition-all cursor-pointer flex items-center justify-between group shadow-lg"
        id="btn-go-to-profile-hardware"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2ba6e2]/20 text-[#2ba6e2] flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#99d6ee] transition-colors">
              Ver Status, Sensor de Vazão & Sinal no Perfil →
            </h4>
            <p className="text-[11px] text-zinc-300">
              Acesse a nova aba de Hardware no seu Perfil para ver telemetria e calibração
            </p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[#2ba6e2] group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>

      {/* Formulário para Conectar (Aparece apenas se 0 dispositivos conectados) */}
      {isAddingNew && !hasConnectedDevice && (
        <form onSubmit={handleCreateDevice} className="p-5 rounded-3xl bg-[#202024] border border-[#2ba6e2]/50 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-white">
            Parear ESP32 Hidrômetro
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Nome do Dispositivo:</label>
              <input
                type="text"
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
                placeholder="Ex: ESP32 Hidrômetro Principal"
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ba6e2]"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Endereço IP (Opcional):</label>
              <input
                type="text"
                value={newDevIp}
                onChange={(e) => setNewDevIp(e.target.value)}
                placeholder="192.168.1.105"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#2ba6e2]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2ba6e2] text-white font-bold text-xs hover:brightness-110 cursor-pointer"
              id="btn-confirm-add-device"
            >
              Conectar Dispositivo
            </button>
          </div>
        </form>
      )}

      {/* Dispositivo Conectado (Apenas 1) */}
      {hasConnectedDevice && currentDevice ? (
        <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#015486]/30 text-[#2ba6e2] border border-[#2ba6e2]/30 flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">{currentDevice.name}</h4>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    !isOffline && currentDevice.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'
                  }`} />
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{currentDevice.model}</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Conexão Ativa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Sensor de Vazão</span>
              <span className="font-bold text-white text-xs">{currentDevice.sensorModel}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Sinal Wi-Fi</span>
              <span className="font-bold text-[#2ba6e2] text-xs">{currentDevice.wifiSignal}% ({currentDevice.wifiRssi} dBm)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">IP na Rede</span>
              <span className="font-bold text-zinc-300 font-mono text-xs">{currentDevice.ip}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Firmware</span>
              <span className="font-bold text-zinc-300 font-mono text-xs">{currentDevice.firmware}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setSelectedDevice(currentDevice)}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Configurar Parâmetros
            </button>

            <button
              onClick={() => {
                removeDevice(currentDevice.id);
                addToast('info', 'Dispositivo Desconectado', 'O ESP32 foi removido.');
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Desconectar dispositivo"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Desconectar</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#202024] rounded-3xl border border-zinc-800 space-y-3">
          <Cpu className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="font-bold text-sm">Nenhum Dispositivo Conectado</h4>
          <p className="text-xs text-zinc-400">
            Conecte seu ESP32 com o sensor de vazão ZJ-S201 para iniciar a medição em tempo real.
          </p>
        </div>
      )}
    </div>
  );
};
