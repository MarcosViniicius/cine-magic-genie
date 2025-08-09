
import { QuizAnswers, MovieFilters, MovieRecommendation } from '../types/cinema';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export const geminiService = {
  async generateRecommendations(
    quizAnswers: QuizAnswers,
    filters: MovieFilters,
    userHistory?: MovieRecommendation[]
  ): Promise<{
    featured: string;
    suggestions: string[];
    reasoning: string;
  }> {
    const prompt = this.buildRecommendationPrompt(quizAnswers, filters, userHistory);
    
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      return this.parseGeminiResponse(text);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      return {
        featured: 'Inception',
        suggestions: ['Matrix', 'Interstellar', 'Blade Runner 2049', 'The Dark Knight'],
        reasoning: 'Baseado em suas preferências por filmes de ficção científica e ação.'
      };
    }
  },

  buildRecommendationPrompt(
    quizAnswers: QuizAnswers,
    filters: MovieFilters,
    userHistory?: MovieRecommendation[]
  ): string {
    const moodText = this.getMoodDescription(quizAnswers.mood);
    const experienceText = this.getExperienceDescription(quizAnswers.experience);
    const timeText = this.getTimeDescription(quizAnswers.timeframe);
    const companyText = this.getCompanyDescription(quizAnswers.company);
    
    let prompt = `Você é o Cinemind AI, um gênio cinematográfico especialista em recomendar filmes, séries e animes.

PERFIL DO USUÁRIO:
- Humor/Mood: ${moodText}
- Experiência desejada: ${experienceText}
- Tempo disponível: ${timeText}
- Companhia: ${companyText}

FILTROS APLICADOS:`;

    if (filters.type && filters.type !== 'all') {
      prompt += `\n- Tipo de conteúdo: ${filters.type === 'movie' ? 'Filmes' : filters.type === 'series' ? 'Séries' : 'Animes'}`;
    }
    
    if (filters.year) {
      prompt += `\n- Período: ${filters.year[0]} - ${filters.year[1]}`;
    }
    
    if (filters.rating) {
      prompt += `\n- Nota mínima: ${filters.rating}/10`;
    }
    
    if (filters.platforms?.length) {
      prompt += `\n- Plataformas preferidas: ${filters.platforms.join(', ')}`;
    }

    if (userHistory?.length) {
      prompt += `\n\nHISTÓRICO DO USUÁRIO (evite repetir):\n${userHistory.map(item => `- ${item.title}`).join('\n')}`;
    }

    prompt += `

TAREFA:
Recomende 1 filme/série/anime PRINCIPAL e 4 SUGESTÕES SIMILARES baseadas no perfil.

FORMATO DE RESPOSTA (EXATO):
FEATURED: [Nome do título principal]
SUGGESTIONS: [Título1], [Título2], [Título3], [Título4]
REASONING: [Explicação personalizada de 2-3 frases sobre por que essas recomendações se encaixam perfeitamente no perfil do usuário]

Use apenas títulos conhecidos e populares. Seja preciso no formato da resposta.`;

    return prompt;
  },

  parseGeminiResponse(text: string): {
    featured: string;
    suggestions: string[];
    reasoning: string;
  } {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      
      let featured = '';
      let suggestions: string[] = [];
      let reasoning = '';
      
      for (const line of lines) {
        if (line.startsWith('FEATURED:')) {
          featured = line.replace('FEATURED:', '').trim();
        } else if (line.startsWith('SUGGESTIONS:')) {
          const suggestionsText = line.replace('SUGGESTIONS:', '').trim();
          suggestions = suggestionsText.split(',').map(s => s.trim());
        } else if (line.startsWith('REASONING:')) {
          reasoning = line.replace('REASONING:', '').trim();
        }
      }
      
      return { featured, suggestions, reasoning };
    } catch (error) {
      console.error('Erro ao parsear resposta do Gemini:', error);
      return {
        featured: 'Inception',
        suggestions: ['Matrix', 'Interstellar', 'Blade Runner 2049', 'The Dark Knight'],
        reasoning: 'Recomendações baseadas em suas preferências cinematográficas.'
      };
    }
  },

  getMoodDescription(mood?: string): string {
    const descriptions = {
      action: 'Busca por adrenalina e ação intensa',
      drama: 'Interesse em histórias emocionalmente profundas',
      comedy: 'Desejo de diversão e entretenimento leve',
      suspense: 'Procura por mistério e tensão',
      adventure: 'Vontade de explorar mundos e aventuras',
      romance: 'Interesse em histórias de amor e relacionamentos'
    };
    return descriptions[mood as keyof typeof descriptions] || 'Humor variado';
  },

  getExperienceDescription(experience?: string): string {
    const descriptions = {
      laugh: 'Quer rir e se divertir',
      cry: 'Busca emoção e catarse',
      thrill: 'Deseja sentir adrenalina',
      learn: 'Interesse em aprender algo novo',
      escape: 'Quer escapar da realidade',
      inspire: 'Busca inspiração e motivação'
    };
    return descriptions[experience as keyof typeof descriptions] || 'Experiência variada';
  },

  getTimeDescription(timeframe?: string): string {
    const descriptions = {
      quick: 'Pouco tempo (30-90 minutos)',
      normal: 'Tempo normal (90-150 minutos)',
      long: 'Muito tempo disponível (150+ minutos)',
      series: 'Quer assistir uma série'
    };
    return descriptions[timeframe as keyof typeof descriptions] || 'Tempo flexível';
  },

  getCompanyDescription(company?: string): string {
    const descriptions = {
      alone: 'Assistindo sozinho',
      partner: 'Assistindo com parceiro romântico',
      friends: 'Assistindo com amigos',
      family: 'Assistindo em família'
    };
    return descriptions[company as keyof typeof descriptions] || 'Companhia variada';
  }
};
