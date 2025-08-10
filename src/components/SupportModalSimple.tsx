import React, { useState } from "react";
import { X, Heart } from "lucide-react";

interface SupportModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModalSimple: React.FC<SupportModalSimpleProps> = ({
  isOpen,
  onClose,
}) => {
  const [payerData, setPayerData] = useState({
    name: "",
    email: "",
  });

  console.log("SupportModalSimple render:", { isOpen });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", payerData);
    alert("Formulário enviado! Dados: " + JSON.stringify(payerData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse-heart">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <style>
              {`
                          @keyframes pulse-heart {
                            0% { transform: scale(1); }
                            30% { transform: scale(1.18); }
                            50% { transform: scale(1.08); }
                            70% { transform: scale(1.18); }
                            100% { transform: scale(1); }
                          }
                          .animate-pulse-heart {
                            animation: pulse-heart 1.2s infinite;
                          }
                          `}
            </style>
            <h3 className="text-xl font-bold text-white">Apoie o Projeto</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-300 mb-4">Teste do modal de pagamento!</p>
            <div className="bg-gradient-to-r from-pink-800/30 to-purple-800/30 rounded-xl p-4 border border-pink-500/30">
              <div className="text-3xl font-bold text-white mb-2">R$ 5,00</div>
              <p className="text-pink-300 text-sm">Contribuição única</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-white text-sm font-medium mb-2"
              >
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                value={payerData.name}
                onChange={(e) =>
                  setPayerData({ ...payerData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-pink-500 focus:outline-none transition-colors"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={payerData.email}
                onChange={(e) =>
                  setPayerData({ ...payerData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-pink-500 focus:outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3"
            >
              <span>Testar Modal</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportModalSimple;
