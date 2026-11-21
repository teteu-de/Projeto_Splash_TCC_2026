import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Wifi, RefreshCw, Download, Trash2, ShieldCheck, Zap, HardDrive, Network } from 'lucide-react';
import { DeviceInfo } from '../../tipos';
import { useApp } from '../../contexto/AppContext';

interface DeviceDetailModalProps {
  device: DeviceInfo | null;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, onClose }) => {
  const { restartDevice, updateDeviceFirmware, removeDevice } = useApp();

  if (!device) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-[#1e1e1e] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-[#015486]/30 text-[#2ba6e2]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Microcontrolador IoT
                </span>
                <h3 className="font-bold text-sm text-white">{device.name}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              id="btn-close-device-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Technical Specs List */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Modelo Hardware:</span>
                <span className="font-bold text-white font-mono">{device.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sensor de Vazão:</span>
                <span className="font-bold text-cyan-300 font-mono">{device.sensorModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Versão Firmware:</span>
                <span className="font-bold text-[#99d6ee] font-mono">{device.firmware}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fator K de Calibração:</span>
                <span className="font-bold text-amber-400 font-mono">K = {device.kFactor}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Endereço IP:</span>
                <span className="font-bold text-white font-mono">{device.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Endereço MAC:</span>
                <span className="font-bold text-zinc-300 font-mono">{device.mac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sinal Wi-Fi RSSI:</span>
                <span className="font-bold text-emerald-400 font-mono">{device.wifiSignal}% ({device.wifiRssi} dBm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tempo Online (Uptime):</span>
                <span className="font-bold text-zinc-300 font-mono">{device.uptimeDays} dias ininterruptos</span>
              </div>
            </div>
          </div>

          {/* Control Actions */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  restartDevice(device.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                id="btn-restart-esp32"
              >
                <RefreshCw className="w-4 h-4 text-[#2ba6e2]" /> Reiniciar ESP32
              </button>

              <button
                onClick={() => {
                  updateDeviceFirmware(device.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#015486] hover:bg-[#2ba6e2] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                id="btn-update-ota"
              >
                <Download className="w-4 h-4" /> Atualizar OTA
              </button>
            </div>

            <button
              onClick={() => {
                removeDevice(device.id);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1.5"
              id="btn-remove-esp32"
            >
              <Trash2 className="w-4 h-4" /> Remover Dispositivo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
