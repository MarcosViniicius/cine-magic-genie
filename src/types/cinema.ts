
export interface QuizAnswers {
  mood?: 'action' | 'drama' | 'comedy' | 'suspense' | 'adventure' | 'romance';
  experience?: 'laugh' | 'cry' | 'thrill' | 'learn' | 'escape' | 'inspire';
  timeframe?: 'quick' | 'normal' | 'long' | 'series';
  company?: 'alone' | 'partner' | 'friends' | 'family';
  style?: 'new' | 'classic' | 'popular' | 'hidden';
}

export interface MovieFilters {
  genre?: string[];
  duration?: [number, number];
  year?: [number, number];
  rating?: number;
  platforms?: string[];
  language?: string;
  type?: 'movie' | 'series' | 'anime' | 'all';
}

export interface MovieRecommendation {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  type: 'movie' | 'tv' | 'anime';
  trailer_key?: string;
  platforms?: string[];
}

export interface AIRecommendationResponse {
  featured: MovieRecommendation;
  suggestions: MovieRecommendation[];
  reasoning: string;
}
