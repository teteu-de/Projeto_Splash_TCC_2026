import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Search, Filter, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { ExportReportModal } from '../janelas/ExportReportModal';

export const HistoryScreen: React.FC = () => {
  const { setScreen } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');

  const historyRecords = [
    { id: 'h1', date: '05/08/2026', time: '07:30', category: 'Chuveiro Banheiro', liters: 42.0, cost: 0.27 },
    { id: 'h2', date: '05/08/2026', time: '08:15', category: 'Máquina de Lavar', liters: 18.2, cost: 0.12 },
    { id: 'h3', date: '05/08/2026', time: '12:00', category: 'Torneira Cozinha', liters: 14.8, cost: 0.10 },
    { id: 'h4', date: '04/08/2026', time: '18:45', category: 'Chuveiro Banheiro', liters: 38.5, cost: 0.25 },
    { id: 'h5', date: '04/08/2026', time: '11:20', category: 'Lava Louças', liters: 12.0, cost: 0.08 },
    { id: 'h6', date: '03/08/2026', time: '19:10', category: 'Irrigação Jardim', liters: 25.4, cost: 0.16 },
    { id: 'h7', date: '02/08/2026', time: '08:00', category: 'Chuveiro Suíte', liters: 44.1, cost: 0.29 }
  ];

  const filteredRecords = historyRecords
    .filter((r) => {
      if (!searchTerm) return true;
      return (
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.includes(searchTerm) ||
        r.liters.toString().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'highest') return b.liters - a.liters;
      if (sortOrder === 'lowest') return a.liters - b.liters;
      return 0; // default recent
    });

  const triggerExport = (format: 'pdf' | 'excel') => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportFormat={exportFormat}
      />

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            id="btn-back-history"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-white">Histórico & Relatórios</h2>
            <p className="text-xs text-zinc-400">Registros de consumo filtráveis e exportáveis</p>
          </div>
        </div>

        {/* Export Dropdown buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => triggerExport('pdf')}
            className="px-2.5 py-1.5 rounded-xl bg-[#015486] text-[#99d6ee] hover:bg-[#2ba6e2] hover:text-white font-bold text-xs flex items-center gap-1"
            id="btn-export-pdf"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={() => triggerExport('excel')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-bold text-xs flex items-center gap-1"
            id="btn-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por categoria (ex: Chuveiro, 42L, 05/08)..."
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2ba6e2]"
        />
      </div>

      {/* Filter Tabs & Order Selector */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <div className="flex items-center gap-1">
          {[
            { id: 'today', label: 'Hoje' },
            { id: 'week', label: 'Semana' },
            { id: 'month', label: 'Mês' },
            { id: 'year', label: 'Ano' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterPeriod === tab.id
                  ? 'bg-[#015486] border-[#2ba6e2] text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium rounded-xl px-2 py-1 focus:outline-none"
        >
          <option value="recent">Mais Recentes</option>
          <option value="highest">Maior Consumo</option>
          <option value="lowest">Menor Consumo</option>
        </select>
      </div>

      {/* History Items List */}
      <div className="space-y-2.5">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#242424] border border-zinc-800 flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs text-white">{item.category}</h4>
              <p className="text-[10px] text-zinc-400">
                {item.date} às {item.time}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#2ba6e2] font-mono">{item.liters} L</div>
              <div className="text-[10px] font-bold text-emerald-400 font-mono">
                R$ {item.cost.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
