
import React, { useState } from 'react';
import { X, Heart, Zap } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [payerData, setPayerData] = useState({
    name: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setPayerData({ name: '', email: '' });
      }, 3000);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center border border-pink-500/30">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Muito Obrigado! 💖</h3>
          <p className="text-slate-300 mb-6">
            Seu apoio é fundamental para manter o Cinemind AI funcionando e melhorando cada dia mais!
          </p>
          <div className="bg-gradient-to-r from-pink-800/30 to-purple-800/30 rounded-xl p-4 border border-pink-500/30">
            <p className="text-pink-300 text-sm">
              ✨ Benefício desbloqueado: Acesso prioritário às novas funcionalidades!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
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
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                value={payerData.name}
                onChange={(e) => setPayerData({ ...payerData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-pink-500 focus:outline-none transition-colors"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={payerData.email}
                onChange={(e) => setPayerData({ ...payerData, email: e.target.value })}
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
                  <Zap className="w-5 h-5" />
                  <span>Finalizar Pagamento</span>
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
