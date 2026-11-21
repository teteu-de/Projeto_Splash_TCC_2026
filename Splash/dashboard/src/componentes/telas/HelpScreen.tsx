import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Cpu, Mail, Phone, BookOpen, Wrench, ShieldCheck } from 'lucide-react';
import { useApp } from '../../contexto/AppContext';
import { tccFaqList } from '../../dados/mockData';

export const HelpScreen: React.FC = () => {
  const { setScreen, t } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'faq' | 'tutorial' | 'contact'>('faq');

  return (
    <div className="p-4 space-y-5 pb-24 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="btn-back-help"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-white">{t('help')}</h2>
          <p className="text-xs text-zinc-400">Manual, FAQ e tutorial de instalação do ESP32</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
        {[
          { id: 'faq', label: 'Perguntas Frequentes' },
          { id: 'contact', label: 'Suporte TCC' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#015486] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {tccFaqList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="p-4 rounded-3xl bg-[#242424] border border-zinc-800 space-y-2 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs text-white"
                >
                  <span className="pr-2">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#2ba6e2] shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                </button>

                {isOpen && (
                  <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800/80">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Support & Contact */}
      {activeTab === 'contact' && (
        <div className="p-5 rounded-3xl bg-[#242424] border border-zinc-800 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white">Suporte Técnico TCC Splash</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <Mail className="w-5 h-5 text-[#2ba6e2]" />
              <div>
                <span className="text-[10px] text-zinc-400">E-mail Acadêmico</span>
                <p className="font-bold text-white">artem.sturtup@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <Phone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-zinc-400">Telefone para contato</span>
                <p className="font-bold text-white">+55 (11) 99999-9999</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
