import React, { useState, useEffect } from "react";
import { X, Heart, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { toast } from "sonner";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [payerData, setPayerData] = useState({
    name: "",
    email: "",
  });

  const { isProcessing, showSuccess, processPayment, resetPayment } =
    usePayment();

  // Debug log
  console.log("SupportModal render:", { isOpen, showSuccess });

  // Verificar se há dados de pagamento salvos
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem("cinemind_payment_data");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setPayerData({ name: data.name, email: data.email });
        } catch (error) {
          console.error("Erro ao carregar dados salvos:", error);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    console.log("Modal is not open, returning null");
    return null;
  }

  console.log("Modal is open, rendering...");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerData.name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (!payerData.email.trim()) {
      toast.error("Por favor, informe seu e-mail.");
      return;
    }
    if (!validateEmail(payerData.email)) {
      toast.error("Por favor, informe um e-mail válido.");
      return;
    }
    await processPayment({ name: payerData.name, email: payerData.email });
  };

  const handleClose = () => {
    resetPayment();
    setPayerData({ name: "", email: "" });
    onClose();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center border border-pink-500/30">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Redirecionando... 🚀
          </h3>
          <p className="text-slate-300 mb-6">
            Você será redirecionado para o Mercado Pago em uma nova aba. Seu
            apoio é fundamental para manter o Cinemind AI gratuito!
          </p>
          <div className="bg-gradient-to-r from-pink-800/30 to-purple-800/30 rounded-xl p-4 border border-pink-500/30">
            <p className="text-pink-300 text-sm">
              ✨ Complete o pagamento para finalizar sua contribuição
            </p>
          </div>
          <button
            onClick={handleClose}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
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
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-300 mb-4">
              Ajude a manter o Cinemind AI gratuito e em constante evolução!
            </p>
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
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 magic-button"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  <span>Pagar via Mercado Pago</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-slate-400 text-xs">
              Pagamento seguro via Mercado Pago • Cartão, Pix e mais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
