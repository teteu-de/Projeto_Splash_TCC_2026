import React, { useState } from 'react';
import {
  ArrowLeft,
  DollarSign,
  TrendingDown,
  Building,
  HelpCircle,
  FileText,
  ChevronDown,
  Info,
  Maximize2,
  ExternalLink,
  Receipt
} from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { BRAZILIAN_UTILITY_PROVIDERS } from '../../dados/tariffsData';
import waterBillImg from '../../recursos/imagens/real_water_bill_breakdown_1791223921084.jpg';

export const BillFinancialScreen: React.FC = () => {
  const {
  setScreen,
  savingsGoal,
  waterProfile,
  getCalculatedBill,
  monthlyCost
} = useApp();

  const [showWhyBillExplanation, setShowWhyBillExplanation] = useState(true);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  // Dynamic bill calculations based on profile & consumption
  const calculatedBill = getCalculatedBill(savingsGoal.currentLitersMonthly);
  const currentCost = monthlyCost?.total ?? calculatedBill.totalCost;
  const projectedCost = Number((currentCost * 1.35).toFixed(2));

  const selectedProvider =
    BRAZILIAN_UTILITY_PROVIDERS[waterProfile.state || 'SP'] || BRAZILIAN_UTILITY_PROVIDERS['SP'];

  return (
    <div className="space-y-5 text-white max-w-4xl mx-auto">
      {/* Modal Zoom da Conta de Água Real Anexada */}
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setShowFullImageModal(false)}
        >
          <div
            className="max-w-xl w-full bg-[#181818] p-4 rounded-3xl border border-zinc-700 space-y-3 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#2ba6e2]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Fatura Real: Cálculo por Economia (Água + Esgoto)
                </span>
              </div>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-white">
              <img
                src={waterBillImg}
                alt="Fatura real de água e esgoto"
                className="w-full object-contain max-h-[72vh] mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1 font-sans">
              <div className="flex items-center justify-between text-white font-bold">
                <span>Leitura / Consumo: 12 m³</span>
                <span className="text-emerald-400">Total: R$ 64,34</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Observe como a tarifa de Água (R$ 32,17) é replicada em 100% como taxa de Esgoto (R$ 32,17), totalizando exatamente o dobro na conta final.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          id="btn-back-bill"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-white">Valor da Conta & Tarifas</h2>
          <p className="text-xs text-zinc-400">
            {selectedProvider.providerName} ({waterProfile.state || 'SP'}) • {waterProfile.city || 'São Paulo'}
          </p>
        </div>
      </div>

      {/* Estimativa Fatura Atual */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#181818] to-zinc-900 border border-emerald-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Estimativa da Fatura Atual
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {selectedProvider.providerName} • {calculatedBill.tierSummary}
          </span>
        </div>

        <div>
          <div className="text-4xl sm:text-5xl font-black text-white font-mono">
            R$ {currentCost.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-400/90 font-medium mt-1">
            {calculatedBill.hasSewage
              ? 'Valor com multiplicador de 2x (tarifa de consumo + taxa de esgoto 100%)'
              : 'Valor sem cobrança de esgoto sanitário'}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Previsão acumulada no fim do mês: <span className="text-emerald-300 font-bold font-mono">R$ {projectedCost.toFixed(2)}</span>
          </p>
        </div>

        {/* Comparativo de Economia */}
        <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Consumo Registrado</span>
            <div className="text-lg font-black text-[#2ba6e2] font-mono">
              {savingsGoal.currentLitersMonthly.toLocaleString('pt-BR')} L
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              ~{(savingsGoal.currentLitersMonthly / 1000).toFixed(2)} m³
            </p>
          </div>
        </div>
      </div>

      {/* Por que a conta vem o dobro? (Explicação Educativa com a Fatura Real Anexada) */}
      <div className="p-5 rounded-3xl bg-[#202024] border border-zinc-800 space-y-4 shadow-lg">
        <button
          onClick={() => setShowWhyBillExplanation(!showWhyBillExplanation)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Por que o valor final da conta de água é praticamente o dobro?
              </h3>
              <p className="text-[11px] text-zinc-400">
                Entenda a incidência legal do serviço de esgoto sanitário (100%)
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              showWhyBillExplanation ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showWhyBillExplanation && (
          <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-300 space-y-3 font-sans leading-relaxed">
            <p>
              No Brasil, as concessionárias de saneamento cobram dois componentes obrigatórios na fatura residencial:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1 text-[11px]">
              <li><strong>Fornecimento de Água Tratada:</strong> Cobrado por faixas de volume consumido (m³).</li>
              <li><strong>Coleta e Tratamento de Esgoto:</strong> Cobrado por lei como uma taxa espelho de <strong>100%</strong> sobre o valor da água.</li>
            </ul>

            {/* Demonstração da Imagem Real Anexada */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#2ba6e2]" />
                  <span>Exemplo Prático de Fatura Real (12 m³):</span>
                </span>
                <button
                  onClick={() => setShowFullImageModal(true)}
                  className="text-xs text-[#2ba6e2] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ampliar Imagem</span>
                </button>
              </div>

              {/* Card com a Imagem Real Anexada */}
              <div
                onClick={() => setShowFullImageModal(true)}
                className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-white cursor-pointer group shadow-md"
              >
                <img
                  src={waterBillImg}
                  alt="Fatura real de água demonstrando cálculo de água e esgoto"
                  className="w-full max-h-64 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                  <div className="flex items-center justify-between w-full text-[11px]">
                    <span className="font-semibold text-white bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      Água: R$ 32,17 + Esgoto: R$ 32,17 = R$ 64,34
                    </span>
                    <span className="font-bold text-[#99d6ee]">Clique para zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Nota Direcionando para Edição no Perfil */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#202024] border border-zinc-800 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#015486]/30 text-[#2ba6e2] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-white">
              Alterações de Tarifas & Imóvel
            </h4>
            <p className="text-[11px] text-zinc-400 font-sans">
              Para alterar estado, cidade ou benefícios, utilize o botão <strong>Editar Informações</strong> no seu Perfil.
            </p>
          </div>
        </div>

        <button
          onClick={() => setScreen('profile')}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-[#2ba6e2] hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Ir para Perfil</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
