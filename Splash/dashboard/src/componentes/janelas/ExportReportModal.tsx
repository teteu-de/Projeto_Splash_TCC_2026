import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, CheckCircle2, ShieldCheck, Printer, Droplet, Cpu } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportFormat: 'pdf' | 'excel';
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, exportFormat }) => {
  const { user, savingsGoal, settings, addToast, triggerConfetti } = useApp();

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    if (exportFormat === 'excel') {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Data,Hora,Litros (L),Custo (R$),Status ESP32\n" +
        "05/08/2026,08:00,18.2,0.12,Online\n" +
        "05/08/2026,07:00,42.0,0.27,Online\n" +
        "05/08/2026,06:00,12.5,0.08,Online\n" +
        "04/08/2026,18:00,32.1,0.21,Online\n" +
        "04/08/2026,12:00,14.8,0.10,Online\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_consumo_splash_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('success', 'Excel Exportado!', 'Arquivo CSV gerado e baixado no seu dispositivo.');
      triggerConfetti();
    } else {
      window.print();
      addToast('success', 'Relatório PDF Gerado!', 'Janela de impressão/PDF aberta com sucesso.');
      triggerConfetti();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-[#181818] border border-zinc-700 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2ba6e2]" />
              <h3 className="font-bold text-sm text-white">
                {exportFormat === 'pdf' ? 'Relatório Oficial em PDF' : 'Exportar Planilha Excel (.CSV)'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              id="btn-close-export-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview (TCC Visual Document) */}
          <div className="p-5 rounded-2xl bg-white text-zinc-900 space-y-4 shadow-inner text-xs font-sans">
            {/* Report Document Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#015486] text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#015486]">SPLASH - RELATÓRIO HÍDRICO</h4>
                  <p className="text-[10px] text-zinc-500">TCC Técnico em Informática • ETEC</p>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">
                AUTENTICADO
              </span>
            </div>

            {/* User & Device Metadata */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <div>
                <span className="text-zinc-500">Usuário:</span>
                <p className="font-bold text-zinc-800">{user.name}</p>
              </div>
              <div>
                <span className="text-zinc-500">Hardware IoT:</span>
                <p className="font-bold text-zinc-800">ESP32 + ZJ-S201</p>
              </div>
              <div>
                <span className="text-zinc-500">Período:</span>
                <p className="font-bold text-zinc-800">Mês de Agosto / 2026</p>
              </div>
              <div>
                <span className="text-zinc-500">Tarifa m³:</span>
                <p className="font-bold text-zinc-800">R$ {settings.waterRatePerM3.toFixed(2)}</p>
              </div>
            </div>

            {/* Summary Data */}
            <div className="space-y-1.5 pt-1">
              <h5 className="font-bold text-[11px] uppercase tracking-wider text-zinc-600">
                Resumo de Consumo
              </h5>
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 text-zinc-500">
                    <th className="py-1">Métrica</th>
                    <th className="py-1 text-right">Valor Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono">
                  <tr>
                    <td className="py-1 font-sans">Total de Litros Acumulado:</td>
                    <td className="py-1 text-right font-bold text-[#015486]">
                      {savingsGoal.currentLitersMonthly} L
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">Estimativa Financeira:</td>
                    <td className="py-1 text-right font-bold text-emerald-700">
                      R$ {savingsGoal.currentCostMonthly.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">Economia vs Mês Anterior:</td>
                    <td className="py-1 text-right font-bold text-emerald-600">-18.4%</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">Ocorrências de Vazamento:</td>
                    <td className="py-1 text-right font-bold text-zinc-700">0 ativas</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer stamp */}
            <div className="pt-2 border-t border-zinc-200 text-[9px] text-zinc-500 flex items-center justify-between">
              <span>Gerado automaticamente pelo aplicativo Splash IoT.</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs"
            >
              Fechar
            </button>
            <button
              onClick={handleDownloadFile}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#015486] to-[#2ba6e2] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 hover:brightness-110"
              id="btn-confirm-download-report"
            >
              <Download className="w-4 h-4" /> Baixar {exportFormat.toUpperCase()}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
