export const MERCADOPAGO_CONFIG = {
  // Configurações do MercadoPago
  ACCESS_TOKEN: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN,
  BASE_URL: 'https://api.mercadopago.com',
  
  // Configurações do produto
  PRODUCT: {
    TITLE: 'Apoio ao Cinemind AI',
    DESCRIPTION: 'Contribuição para manter o projeto gratuito e em evolução',
    PRICE: 5.00,
    CURRENCY: 'BRL',
    QUANTITY: 1
  },
  
  // URLs de retorno
  BACK_URLS: {
    success: `${window.location.origin}?payment=success`,
    failure: `${window.location.origin}?payment=failure`,
    pending: `${window.location.origin}?payment=pending`
  },
  
  // Configurações do checkout
  CHECKOUT: {
    AUTO_RETURN: 'approved',
    EXTERNAL_REFERENCE_PREFIX: 'cinemind'
  },
  
  // Verificar se está em modo de demonstração
  isDemoMode(): boolean {
    return !this.ACCESS_TOKEN || this.ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN';
  },
  
  // Gerar referência externa única
  generateExternalReference(): string {
    return `${this.CHECKOUT.EXTERNAL_REFERENCE_PREFIX}_${Date.now()}`;
  }
}; 