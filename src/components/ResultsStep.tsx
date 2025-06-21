import React, { useState, useEffect } from 'react';
import { Star, Play, Share, Heart, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { QuizAnswers, MovieFilters, MovieRecommendation } from '../types/cinema';
import { useToast } from '../hooks/use-toast';

interface ResultsStepProps {
  quizAnswers: QuizAnswers;
  filters: MovieFilters;
  onNewSearch: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ quizAnswers, filters, onNewSearch }) => {
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<MovieRecommendation | null>(null);
  const [suggestions, setSuggestions] = useState<MovieRecommendation[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call with mock data for now
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockFeatured: MovieRecommendation = {
      id: 1,
      title: "O Senhor dos Anéis: A Sociedade do Anel",
      poster_path: "/placeholder.svg",
      overview: "Um hobbit relutante, Bilbo Baggins, parte em uma jornada épica através da Terra-média com um grupo de anões para reclamar seu tesouro de um dragão chamado Smaug.",
      vote_average: 8.8,
      release_date: "2001-12-19",
      genre_ids: [28, 12, 14],
      type: 'movie' as const,
      trailer_key: "dQw4w9WgXcQ",
      platforms: ['hbo', 'prime']
    };

    const mockSuggestions: MovieRecommendation[] = [
      {
        id: 2,
        title: "Matrix",
        poster_path: "/placeholder.svg",
        overview: "Um programador descobre que a realidade que conhece é uma simulação.",
        vote_average: 8.7,
        release_date: "1999-03-31",
        genre_ids: [28, 878],
        type: 'movie' as const,
        platforms: ['netflix']
      },
      {
        id: 3,
        title: "Breaking Bad",
        poster_path: "/placeholder.svg",
        overview: "Um professor de química se torna um fabricante de drogas.",
        vote_average: 9.5,
        release_date: "2008-01-20",
        genre_ids: [80, 18],
        type: 'tv' as const,
        platforms: ['netflix']
      },
      {
        id: 4,
        title: "Attack on Titan",
        poster_path: "/placeholder.svg",
        overview: "Humanidade luta contra titãs gigantes em uma batalha pela sobrevivência.",
        vote_average: 9.0,
        release_date: "2013-04-07",
        genre_ids: [16, 28, 18],
        type: 'anime' as const,
        platforms: ['netflix']
      },
      {
        id: 5,
        title: "Interstellar",
        poster_path: "/placeholder.svg",
        overview: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.",
        vote_average: 8.6,
        release_date: "2014-11-07",
        genre_ids: [18, 878],
        type: 'movie' as const,
        platforms: ['prime', 'paramount']
      }
    ];

    setFeaturedMovie(mockFeatured);
    setSuggestions(mockSuggestions);
    setLoading(false);
  };

  const toggleFavorite = (movieId: number) => {
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];
    setFavorites(newFavorites);
    
    const action = favorites.includes(movieId) ? 'removido dos' : 'adicionado aos';
    toast({
      title: `Filme ${action} favoritos!`,
      description: "Sua lista foi atualizada com sucesso.",
    });
  };

  const shareRecommendation = (movie: MovieRecommendation) => {
    const text = `O Cinemind AI me recomendou "${movie.title}" e acho que você vai adorar! 🎬✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getPlatformInfo = (platforms: string[] = []) => {
    const platformMap: { [key: string]: { name: string; color: string } } = {
      netflix: { name: 'Netflix', color: 'bg-red-600' },
      prime: { name: 'Prime', color: 'bg-blue-600' },
      disney: { name: 'Disney+', color: 'bg-indigo-600' },
      hbo: { name: 'HBO Max', color: 'bg-purple-600' },
      paramount: { name: 'Paramount+', color: 'bg-blue-500' },
      apple: { name: 'Apple TV+', color: 'bg-gray-600' }
    };

    return platforms.map(p => platformMap[p]).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-white mb-4">Conjurando recomendações mágicas...</h2>
          <p className="text-slate-300">Nosso Cine-Gênio está analisando seus gostos únicos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400 genie-sparkle" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sua Magia Cinematográfica Está Pronta!
          </h2>
          <p className="text-xl text-slate-300">
            O Cine-Gênio escolheu especialmente para você...
          </p>
        </div>

        {/* Featured Recommendation */}
        {featuredMovie && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                O feitiço cinematográfico perfeito para sua noite é...
              </h3>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-3xl p-8 border-2 border-yellow-400/30 cinema-glow max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="relative group">
                    <img
                      src={featuredMovie.poster_path}
                      alt={featuredMovie.title}
                      className="w-full rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-4xl font-bold text-white mb-4">{featuredMovie.title}</h4>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">{featuredMovie.overview}</p>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex items-center mr-6">
                      <Star className="w-6 h-6 text-yellow-400 mr-2" />
                      <span className="text-2xl font-bold text-white">{featuredMovie.vote_average}</span>
                      <span className="text-slate-300 ml-1">/10</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-slate-300 mr-3">Disponível em:</span>
                      {getPlatformInfo(featuredMovie.platforms).map((platform, index) => (
                        <span key={index} className={`${platform.color} text-white px-3 py-1 rounded-full text-sm mr-2`}>
                          {platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-full flex items-center magic-button">
                      <Play className="w-5 h-5 mr-2" />
                      Ver Trailer
                    </button>
                    <button
                      onClick={() => toggleFavorite(featuredMovie.id)}
                      className={`${
                        favorites.includes(featuredMovie.id)
                          ? 'bg-gradient-to-r from-pink-600 to-pink-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      } text-white font-bold py-3 px-6 rounded-full flex items-center magic-button`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${favorites.includes(featuredMovie.id) ? 'fill-current' : ''}`} />
                      {favorites.includes(featuredMovie.id) ? 'Favoritado' : 'Favoritar'}
                    </button>
                    <button
                      onClick={() => shareRecommendation(featuredMovie)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full flex items-center magic-button"
                    >
                      <Share className="w-5 h-5 mr-2" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Suggestions */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Outras joias que o Gênio descobriu para você
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((movie) => (
              <div key={movie.id} className="group">
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-2">
                  <div className="relative mb-4">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleFavorite(movie.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          favorites.includes(movie.id)
                            ? 'bg-pink-600 text-white'
                            : 'bg-black/50 text-white hover:bg-pink-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(movie.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">{movie.title}</h4>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{movie.overview}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white font-semibold">{movie.vote_average}</span>
                    </div>
                    <span className="text-slate-400 text-sm capitalize">{movie.type}</span>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {getPlatformInfo(movie.platforms).slice(0, 2).map((platform, index) => (
                      <span key={index} className={`${platform.color} text-white px-2 py-1 rounded text-xs`}>
                        {platform.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Detalhes
                    </button>
                    <button
                      onClick={() => shareRecommendation(movie)}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={generateRecommendations}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-xl magic-button cinema-glow inline-flex items-center mr-4"
          >
            <RefreshCw className="w-6 h-6 mr-3" />
            Surpreenda-me Novamente!
          </button>
          
          <button
            onClick={onNewSearch}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-12 rounded-full text-xl magic-button inline-flex items-center"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Nova Busca Mágica
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;
