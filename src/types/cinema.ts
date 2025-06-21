
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
  isFavorite?: boolean;
  addedToHistoryAt?: string;
}

export interface AIRecommendationResponse {
  featured: MovieRecommendation;
  suggestions: MovieRecommendation[];
  reasoning: string;
}

export interface UserPreferences {
  favoriteGenres: number[];
  watchHistory: MovieRecommendation[];
  preferredPlatforms: string[];
  averageRatingPreference: number;
  contentTypePreference: 'movie' | 'tv' | 'anime' | 'all';
}

export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
}

export interface TrailerData {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}
