import React, { useState, useEffect } from 'react';
import { Star, Play, Share, Heart, RefreshCw, Sparkles, Youtube, Info } from 'lucide-react';
import { QuizAnswers, MovieFilters, MovieRecommendation } from '../types/cinema';
import { useToast } from '../hooks/use-toast';
import { tmdbService } from '../services/tmdbService';
import { geminiService } from '../services/geminiService';
import { useFavorites } from '../hooks/useFavorites';
import TrailerModal from './TrailerModal';
import MovieDetailsModal from './MovieDetailsModal';

interface ResultsStepProps {
  quizAnswers: QuizAnswers;
  filters: MovieFilters;
  onNewSearch: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ quizAnswers, filters, onNewSearch }) => {
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<MovieRecommendation | null>(null);
  const [suggestions, setSuggestions] = useState<MovieRecommendation[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; videoKey: string; title: string }>({
    isOpen: false,
    videoKey: '',
    title: ''
  });
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; movie: MovieRecommendation | null }>({
    isOpen: false,
    movie: null
  });
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite, addToHistory, history } = useFavorites();

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      const aiRecommendations = await geminiService.generateRecommendations(
        quizAnswers,
        filters,
        history.slice(0, 10)
      );

      console.log('Recomendações da IA:', aiRecommendations);
      
      const [featuredData, ...suggestionsData] = await Promise.all([
        searchMovieDetails(aiRecommendations.featured),
        ...aiRecommendations.suggestions.map(title => searchMovieDetails(title))
      ]);

      if (featuredData) {
        setFeaturedMovie(featuredData);
        addToHistory(featuredData);
      }

      const validSuggestions = suggestionsData.filter(Boolean) as MovieRecommendation[];
      setSuggestions(validSuggestions);
      setReasoning(aiRecommendations.reasoning);

    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      toast({
        title: "Ops! O gênio está com problemas",
        description: "Vamos tentar com algumas recomendações populares por enquanto.",
        variant: "destructive"
      });
      
      await generateFallbackRecommendations();
    }
    
    setLoading(false);
  };

  const searchMovieDetails = async (title: string): Promise<MovieRecommendation | null> => {
    try {
      const [movieResults, tvResults] = await Promise.all([
        tmdbService.searchMovies(title),
        tmdbService.searchTV(title)
      ]);

      const allResults = [
        ...movieResults.results.map(item => ({ ...item, type: 'movie' as const })),
        ...tvResults.results.map(item => ({ ...item, type: 'tv' as const }))
      ];

      if (allResults.length === 0) return null;

      const bestMatch = allResults[0];
      const movieTitle = bestMatch.title || bestMatch.name || '';
      
      return {
        id: bestMatch.id,
        title: movieTitle,
        poster_path: tmdbService.getImageUrl(bestMatch.poster_path),
        overview: bestMatch.overview || 'Descrição não disponível.',
        vote_average: bestMatch.vote_average,
        release_date: bestMatch.release_date || bestMatch.first_air_date || '',
        genre_ids: bestMatch.genre_ids,
        type: bestMatch.type,
        platforms: getRandomPlatforms()
      };
    } catch (error) {
      console.error(`Erro ao buscar detalhes para: ${title}`, error);
      return null;
    }
  };

  const generateFallbackRecommendations = async () => {
    try {
      const popularMovies = await tmdbService.getPopularMovies();
      const popularTV = await tmdbService.getPopularTV();
      
      const allContent = [
        ...popularMovies.results.slice(0, 3).map(item => ({ ...item, type: 'movie' as const })),
        ...popularTV.results.slice(0, 2).map(item => ({ ...item, type: 'tv' as const }))
      ];

      const processedContent = allContent.map(item => ({
        id: item.id,
        title: item.title || item.name || '',
        poster_path: tmdbService.getImageUrl(item.poster_path),
        overview: item.overview || 'Descrição não disponível.',
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date || '',
        genre_ids: item.genre_ids,
        type: item.type,
        platforms: getRandomPlatforms()
      }));

      setFeaturedMovie(processedContent[0]);
      setSuggestions(processedContent.slice(1));
      setReasoning('Selecionamos os conteúdos mais populares e bem avaliados para você descobrir!');
    } catch (error) {
      console.error('Erro no fallback:', error);
    }
  };

  const getRandomPlatforms = (): string[] => {
    const platforms = ['netflix', 'prime', 'disney', 'hbo', 'paramount'];
    const count = Math.floor(Math.random() * 3) + 1;
    return platforms.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const handleWatchTrailer = async (movie: MovieRecommendation) => {
    try {
      const videos = movie.type === 'movie' 
        ? await tmdbService.getMovieVideos(movie.id)
        : await tmdbService.getTVVideos(movie.id);
      
      const trailer = videos.results?.find((video: any) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        setTrailerModal({
          isOpen: true,
          videoKey: trailer.key,
          title: movie.title
        });
      } else {
        toast({
          title: "Trailer não encontrado",
          description: "Infelizmente não conseguimos encontrar um trailer para este título.",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar trailer:', error);
      toast({
        title: "Erro ao carregar trailer",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const shareRecommendation = (movie: MovieRecommendation) => {
    const text = `🎬✨ O Cinemind AI me recomendou "${movie.title}" e acho que você vai adorar!\n\n${movie.overview}\n\n⭐ Nota: ${movie.vote_average}/10\n\nDescubra sua próxima obsessão cinematográfica: https://cinemind-ai.lovable.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openMovieDetails = (movie: MovieRecommendation) => {
    setDetailsModal({ isOpen: true, movie });
  };

  const getPlatformInfo = (platforms: string[] = []) => {
    const platformMap: { [key: string]: { name: string; color: string } } = {
      netflix: { name: 'Netflix', color: 'bg-red-600' },
      prime: { name: 'Prime Video', color: 'bg-blue-600' },
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
          <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 genie-sparkle"></div>
          <h2 className="text-3xl font-bold text-white mb-4">🧞‍♂️ Conjurando recomendações mágicas...</h2>
          <p className="text-slate-300">Nosso Cine-Gênio está analisando seus gostos únicos</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
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
            🧞‍♂️ Sua Magia Cinematográfica Está Pronta!
          </h2>
          <p className="text-xl text-slate-300 mb-6">
            O Cine-Gênio escolheu especialmente para você...
          </p>
          
          {reasoning && (
            <div className="bg-gradient-to-r from-pink-800/30 to-purple-800/30 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 max-w-2xl mx-auto">
              <p className="text-slate-200 text-lg italic">"{reasoning}"</p>
            </div>
          )}
        </div>

        {/* Featured Recommendation */}
        {featuredMovie && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                ✨ O feitiço cinematográfico perfeito para sua noite é...
              </h3>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-3xl p-8 border-2 border-yellow-400/30 cinema-glow max-w-4xl mx-auto hover:border-yellow-400/50 transition-all duration-500">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="relative group">
                    <img
                      src={featuredMovie.poster_path}
                      alt={featuredMovie.title}
                      className="w-full rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => handleWatchTrailer(featuredMovie)}
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-4xl font-bold text-white mb-4">{featuredMovie.title}</h4>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">{featuredMovie.overview}</p>
                  
                  <div className="flex items-center mb-6 flex-wrap gap-4">
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-yellow-400 mr-2" />
                      <span className="text-2xl font-bold text-white">{featuredMovie.vote_average.toFixed(1)}</span>
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
                    <button 
                      onClick={() => handleWatchTrailer(featuredMovie)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button"
                    >
                      <Youtube className="w-5 h-5 mr-2" />
                      Ver Trailer
                    </button>
                    <button
                      onClick={() => openMovieDetails(featuredMovie)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button"
                    >
                      <Info className="w-5 h-5 mr-2" />
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => toggleFavorite(featuredMovie)}
                      className={`${
                        isFavorite(featuredMovie.id)
                          ? 'bg-gradient-to-r from-pink-600 to-pink-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      } text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isFavorite(featuredMovie.id) ? 'fill-current' : ''}`} />
                      {isFavorite(featuredMovie.id) ? 'Favoritado' : 'Favoritar'}
                    </button>
                    <button
                      onClick={() => shareRecommendation(featuredMovie)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button"
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
            🎭 Outras joias que o Gênio descobriu para você
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((movie) => (
              <div key={movie.id} className="group">
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-600 hover:border-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/25 hover:-translate-y-2">
                  <div className="relative mb-4">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isFavorite(movie.id)
                            ? 'bg-pink-600 text-white'
                            : 'bg-black/50 text-white hover:bg-pink-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(movie.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <button
                        onClick={() => handleWatchTrailer(movie)}
                        className="w-10 h-10 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                      >
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">{movie.title}</h4>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{movie.overview}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
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
                    <button 
                      onClick={() => openMovieDetails(movie)}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center magic-button"
                    >
                      <Info className="w-4 h-4 mr-1" />
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
            🎲 Surpreenda-me Novamente!
          </button>
          
          <button
            onClick={onNewSearch}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-12 rounded-full text-xl magic-button inline-flex items-center"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Nova Busca Mágica
          </button>
        </div>

        {/* Modals */}
        <TrailerModal
          isOpen={trailerModal.isOpen}
          onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
          videoKey={trailerModal.videoKey}
          title={trailerModal.title}
        />

        <MovieDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, movie: null })}
          movie={detailsModal.movie}
          onWatchTrailer={handleWatchTrailer}
        />
      </div>
    </div>
  );
};

export default ResultsStep;
