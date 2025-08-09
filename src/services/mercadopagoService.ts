import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';

interface MercadoPagoPreference {
  items: Array<{
    title: string;
    description: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }>;
  payer: {
    name: string;
    email: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
  notification_url?: string;
}

interface MercadoPagoResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export class MercadoPagoService {
  private accessToken: string;
  private baseURL: string;

  constructor() {
    this.accessToken = MERCADOPAGO_CONFIG.ACCESS_TOKEN;
    this.baseURL = MERCADOPAGO_CONFIG.BASE_URL;
    
    if (MERCADOPAGO_CONFIG.isDemoMode()) {
      console.warn('MercadoPago access token não configurado. Usando modo de demonstração.');
    }
  }

  async createPreference(preferenceData: MercadoPagoPreference): Promise<MercadoPagoResponse> {
    // Se não há token configurado, simular resposta
    if (!this.accessToken || this.accessToken === 'YOUR_ACCESS_TOKEN') {
      return this.simulatePreferenceResponse();
    }

    try {
      const response = await fetch(`${this.baseURL}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        throw new Error(`Erro na API do MercadoPago: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      throw error;
    }
  }

  private simulatePreferenceResponse(): MercadoPagoResponse {
    // Simular resposta para demonstração
    return {
      id: `demo_${Date.now()}`,
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=demo',
      sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=demo'
    };
  }

  // Verificar status do pagamento (para webhooks)
  async getPaymentStatus(paymentId: string): Promise<any> {
    if (!this.accessToken || this.accessToken === 'YOUR_ACCESS_TOKEN') {
      return { status: 'approved', status_detail: 'demo' };
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar pagamento: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }
}

export const mercadopagoService = new MercadoPagoService(); 