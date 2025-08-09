import { useState } from 'react';
import { mercadopagoService } from '@/services/mercadopagoService';
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';
import { toast } from 'sonner';

interface PaymentData {
  name: string;
  email: string;
}

interface UsePaymentReturn {
  isProcessing: boolean;
  showSuccess: boolean;
  processPayment: (data: PaymentData) => Promise<void>;
  resetPayment: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const processPayment = async (data: PaymentData) => {
    setIsProcessing(true);
    
    try {
      const preferenceData = {
        items: [
          {
            title: MERCADOPAGO_CONFIG.PRODUCT.TITLE,
            description: MERCADOPAGO_CONFIG.PRODUCT.DESCRIPTION,
            quantity: MERCADOPAGO_CONFIG.PRODUCT.QUANTITY,
            currency_id: MERCADOPAGO_CONFIG.PRODUCT.CURRENCY,
            unit_price: MERCADOPAGO_CONFIG.PRODUCT.PRICE
          }
        ],
        payer: {
          name: data.name,
          email: data.email
        },
        back_urls: MERCADOPAGO_CONFIG.BACK_URLS,
        auto_return: MERCADOPAGO_CONFIG.CHECKOUT.AUTO_RETURN,
        external_reference: MERCADOPAGO_CONFIG.generateExternalReference(),
        notification_url: `${window.location.origin}/api/webhook/mercadopago`
      };

      const preference = await mercadopagoService.createPreference(preferenceData);
      
      // Salvar dados do pagamento no localStorage
      localStorage.setItem('cinemind_payment_data', JSON.stringify({
        name: data.name,
        email: data.email,
        preferenceId: preference.id,
        timestamp: Date.now()
      }));

      // Redirecionar para o checkout
      const checkoutUrl = preference.init_point || preference.sandbox_init_point;
      window.open(checkoutUrl, '_blank');
      
      setShowSuccess(true);
      toast.success('Redirecionando para o Mercado Pago...');
      
      // Reset após 5 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    setShowSuccess(false);
    setIsProcessing(false);
  };

  return {
    isProcessing,
    showSuccess,
    processPayment,
    resetPayment
  };
} 