import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, ShieldAlert, Check, Trash2, Clock, Calendar, Lightbulb, DollarSign } from 'lucide-react';
import { WaterAlert } from '../../tipos';
import { useApp } from '../../contexto/AppContext';

interface AlertDetailModalProps {
  alert: WaterAlert | null;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose }) => {
  const { markAlertRead, deleteAlert } = useApp();

  if (!alert) return null;

  const isCritical = alert.riskLevel === 'critical' || alert.riskLevel === 'high';
  const isMedium = alert.riskLevel === 'medium';

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
              <div
                className={`p-2 rounded-xl ${
                  isCritical ? 'bg-red-950 text-red-400' : isMedium ? 'bg-amber-950 text-amber-400' : 'bg-cyan-950 text-cyan-400'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Detalhes do Alerta IoT
                </span>
                <h3 className="font-bold text-sm text-white">{alert.title}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              id="btn-close-alert-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Badge & Time */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] border ${
                isCritical
                  ? 'bg-red-900/40 border-red-500/50 text-red-300'
                  : isMedium
                  ? 'bg-amber-900/40 border-amber-500/50 text-amber-300'
                  : 'bg-[#015486]/40 border-[#2ba6e2]/50 text-[#99d6ee]'
              }`}
            >
              Nível de Risco: {alert.riskLevel.toUpperCase()}
            </span>

            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{alert.date} às {alert.timestamp}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
            {alert.description}
          </div>

          {/* Impact if available */}
          {alert.litersWasted !== undefined && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400">Água Desperdiçada</span>
                <div className="text-sm font-bold text-red-400 font-mono">{alert.litersWasted} Litros</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400">Prejuízo Financeiro</span>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  R$ {alert.financialImpact?.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="p-3.5 rounded-2xl bg-[#015486]/30 border border-[#2ba6e2]/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#99d6ee] font-bold">
              <Lightbulb className="w-4 h-4 text-[#2ba6e2]" />
              <span>Recomendação Técnica:</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-snug">{alert.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            {!alert.read && (
              <button
                onClick={() => {
                  markAlertRead(alert.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#015486] text-white font-bold text-xs hover:bg-[#2ba6e2] transition-colors flex items-center justify-center gap-1.5"
                id="btn-alert-mark-read"
              >
                <Check className="w-4 h-4" /> Marcar Lido
              </button>
            )}

            <button
              onClick={() => {
                deleteAlert(alert.id);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1.5"
              id="btn-alert-delete"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
