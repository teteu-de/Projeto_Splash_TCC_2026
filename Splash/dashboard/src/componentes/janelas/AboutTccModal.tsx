import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Droplet, Award, Github, Mail, ShieldCheck } from 'lucide-react';

interface AboutTccModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutTccModal: React.FC<AboutTccModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-[#1e1e1e] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#015486] to-[#2ba6e2]">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Sobre o Splash</h3>
                <p className="text-[10px] text-zinc-400">Versão 1.0.0-PROD</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              id="btn-close-about-tcc"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
            <p>
              <strong className="text-white">Splash</strong> é um aplicativo inteligente de monitoramento do consumo de água residencial. O sistema utiliza um <strong className="text-[#99d6ee]">ESP32</strong> conectado a um sensor de vazão <strong className="text-[#99d6ee]">ZJ-S201</strong> instalado após o hidrômetro.
            </p>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-[#2ba6e2]">
                Escopo & Funcionamento do Sistema
              </h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-300 list-disc list-inside">
                <li><strong className="text-white">Medição Contínua:</strong> O sensor mede continuamente a quantidade de água na tubulação e envia os dados ao app.</li>
                <li><strong className="text-white">Sem Controle Ativo:</strong> O Splash NÃO controla registros, válvulas ou o fornecimento de água. Sua função é exclusivamente monitorar e apresentar informações.</li>
                <li><strong className="text-white">Estimativa de Custos:</strong> Converte automaticamente o volume (litros) em reais (R$) com base na tarifa configurada.</li>
                <li><strong className="text-white">Metas & Notificações:</strong> Permite definir metas de economia e limites mensais, alertando ao aproximar-se ou ultrapassar.</li>
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1 text-[11px]">
              <span className="text-[10px] font-bold uppercase text-[#2ba6e2]">Especificações Técnicas IoT</span>
              <p><strong className="text-zinc-200">Hardware:</strong> ESP32 NodeMCU Wi-Fi + Sensor ZJ-S201 (G1/2")</p>
              <p><strong className="text-zinc-200">Calibração:</strong> Fator K = 7.5 impulsos/Litro</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#015486]/30 border border-[#2ba6e2]/30 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#99d6ee]">Desenvolvimento do Projeto</span>
              <p className="font-bold text-white text-xs">Gabriel Vissotto & Equipe</p>
              <p className="text-[10px] text-zinc-400">Projeto Hidrômetro Inteligente IoT</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#015486] text-white font-bold text-xs hover:bg-[#2ba6e2]"
          >
            Fechar Informações
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
