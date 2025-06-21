
export interface QuizAnswers {
  mood?: string;
  genre?: string;
  decade?: string;
  length?: string;
  platform?: string;
  watchWith?: string;
  content?: string;
  setting?: string;
  language?: string;
  ratings?: string;
  [key: string]: string | undefined;
}

export interface MovieFilters {
  genres?: number[];
  year?: number;
  rating?: number;
  sort?: string;
  platforms?: string[];
  duration?: string;
  adult?: boolean;
  [key: string]: any;
}

export interface MovieRecommendation {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count?: number;
  release_date: string;
  genre_ids: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  media_type?: 'movie' | 'tv';
  // Campos para histórico e favoritos
  viewedAt?: string;
  favoriteAt?: string;
}

export interface CinemaGenre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
  logo: string;
}

// Tipos específicos para a API do Gemini
export interface GeminiAnalysis {
  mood: string;
  preferences: string[];
  recommendations: {
    primary: MovieRecommendation;
    similar: MovieRecommendation[];
  };
  reasoning: string;
}

// Tipos para configurações do usuário
export interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  language: 'pt' | 'en' | 'es';
  notifications: boolean;
  autoplay: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  adultContent: boolean;
}

// Tipos para detalhes de filmes/séries
export interface MovieDetails extends MovieRecommendation {
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  genres?: CinemaGenre[];
  production_companies?: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages?: {
    iso_639_1: string;
    name: string;
  }[];
}

export interface MovieCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string;
  }[];
}

export interface MovieVideos {
  results: {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    published_at: string;
  }[];
}
