import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export function PaymentStatusChecker() {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (paymentStatus) {
      const paymentData = localStorage.getItem('cinemind_payment_data');
      
      switch (paymentStatus) {
        case 'success':
          toast.success('Pagamento realizado com sucesso! Obrigado pelo seu apoio! 💖', {
            duration: 5000,
            icon: <CheckCircle className="w-5 h-5 text-green-500" />
          });
          
          // Limpar dados do localStorage após sucesso
          if (paymentData) {
            localStorage.removeItem('cinemind_payment_data');
          }
          break;
          
        case 'failure':
          toast.error('Pagamento não foi concluído. Tente novamente quando quiser.', {
            duration: 5000,
            icon: <XCircle className="w-5 h-5 text-red-500" />
          });
          break;
          
        case 'pending':
          toast.info('Pagamento em processamento. Você receberá uma confirmação em breve.', {
            duration: 5000,
            icon: <Clock className="w-5 h-5 text-blue-500" />
          });
          break;
      }
      
      // Limpar parâmetros da URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('payment');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [paymentStatus]);

  return null; // Componente não renderiza nada visualmente
} 