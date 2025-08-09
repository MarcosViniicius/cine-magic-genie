// API Client with error handling and interceptors
class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      language: 'pt-BR',
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ),
    });

    return this.request<T>(`${endpoint}?${searchParams}`);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// TMDB API Client
export const tmdbClient = new ApiClient(
  import.meta.env.VITE_TMDB_BASE_URL,
  import.meta.env.VITE_TMDB_API_KEY
);

// Gemini API Client
export const geminiClient = new ApiClient(
  import.meta.env.VITE_GEMINI_API_URL.replace('/generateContent', ''),
  import.meta.env.VITE_GEMINI_API_KEY
); 