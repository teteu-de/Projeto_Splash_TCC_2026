import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, ShieldAlert, Target, CheckCircle2, ChevronRight, Bell } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { WaterAlert } from '../../tipos';
import { AlertDetailModal } from '../janelas/AlertDetailModal';

export const AlertsCenterScreen: React.FC = () => {
  const { setScreen, alerts, markAlertRead } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<WaterAlert | null>(null);

  // Centralizado em uma aba só: apenas Consumo Muito Alto, Meta Mensal Atingiu 50% e Possíveis Vazamentos
  const allowedTypes: WaterAlert['type'][] = ['leak', 'high_consumption', 'goal_exceeded'];

  const centralizedAlerts = alerts.filter((a) => allowedTypes.includes(a.type));

  const getAlertIcon = (type: WaterAlert['type']) => {
    switch (type) {
      case 'leak':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'high_consumption':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'goal_exceeded':
        return <Target className="w-5 h-5 text-[#2ba6e2]" />;
      default:
        return <Bell className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getAlertTag = (type: WaterAlert['type']) => {
    switch (type) {
      case 'leak':
        return { label: 'Possível Vazamento', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'high_consumption':
        return { label: 'Consumo Muito Alto', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'goal_exceeded':
        return { label: 'Meta Mensal 50%', color: 'bg-[#015486]/30 text-[#99d6ee] border-[#2ba6e2]/40' };
      default:
        return { label: 'Alerta', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  return (
    <div className="space-y-5 text-white max-w-4xl mx-auto">
      <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            id="btn-back-alerts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white">Central de Alertas</h2>
            <p className="text-xs text-zinc-400">
              Notificações de vazamentos, alto consumo e metas
            </p>
          </div>
        </div>

        <button
          onClick={() => centralizedAlerts.forEach((a) => markAlertRead(a.id))}
          className="text-xs font-semibold text-[#2ba6e2] hover:underline cursor-pointer"
          id="btn-mark-all-alerts-read"
        >
          Marcar Lidos
        </button>
      </div>

      {/* Lista Centralizada Única (Sem abas/filtros fragmentados) */}
      <div className="space-y-3">
        {centralizedAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#202024] rounded-3xl border border-zinc-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Nenhum Alerta Ativo</h4>
            <p className="text-xs text-zinc-400">
              Não há registros de vazamentos, picos extremos ou metas críticas no momento.
            </p>
          </div>
        ) : (
          centralizedAlerts.map((alert) => {
            const tag = getAlertTag(alert.type);
            return (
              <div
                key={alert.id}
                onClick={() => {
                  setSelectedAlert(alert);
                  markAlertRead(alert.id);
                }}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                  !alert.read
                    ? 'bg-[#222228] border-[#2ba6e2]/40 shadow-lg'
                    : 'bg-[#1a1a1c] border-zinc-800/80 hover:bg-[#202024]'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tag.color}`}>
                        {tag.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {alert.timestamp} • {alert.date}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white group-hover:text-[#2ba6e2] transition-colors">
                      {alert.title}
                    </h4>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {alert.description}
                    </p>

                    {alert.recommendation && (
                      <p className="text-[11px] text-zinc-400 italic bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/60">
                        💡 {alert.recommendation}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0 mt-3" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
