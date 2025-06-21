
const TMDB_API_KEY = '70d798d2f4fa74b428eadefe2bf5ae77';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  video?: boolean;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export const tmdbService = {
  async searchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`
    );
    return response.json();
  },

  async searchTV(query: string, page = 1): Promise<TMDBSearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`
    );
    return response.json();
  },

  async getPopularMovies(page = 1): Promise<TMDBSearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=pt-BR`
    );
    return response.json();
  },

  async getPopularTV(page = 1): Promise<TMDBSearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}&language=pt-BR`
    );
    return response.json();
  },

  async discoverMovies(filters: {
    genre?: number[];
    year?: number;
    rating?: number;
    sort?: string;
  }): Promise<TMDBSearchResponse> {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'pt-BR',
      sort_by: filters.sort || 'popularity.desc',
    });

    if (filters.genre?.length) {
      params.append('with_genres', filters.genre.join(','));
    }
    if (filters.year) {
      params.append('year', filters.year.toString());
    }
    if (filters.rating) {
      params.append('vote_average.gte', filters.rating.toString());
    }

    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`);
    return response.json();
  },

  async getMovieDetails(movieId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getTVDetails(tvId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getMovieCredits(movieId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getTVCredits(tvId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getMovieVideos(movieId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getTVVideos(tvId: number): Promise<any> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/placeholder.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};
