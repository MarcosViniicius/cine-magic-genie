
import React, { useState, useEffect } from 'react';
import { X, Star, Play, Heart, Share, ExternalLink, Calendar, Clock } from 'lucide-react';
import { MovieRecommendation } from '../types/cinema';
import { tmdbService } from '../services/tmdbService';
import { useFavorites } from '../hooks/useFavorites';

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieRecommendation | null;
  onWatchTrailer: (movie: MovieRecommendation) => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  movie, 
  onWatchTrailer 
}) => {
  const [details, setDetails] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (isOpen && movie) {
      loadMovieDetails();
    }
  }, [isOpen, movie]);

  const loadMovieDetails = async () => {
    if (!movie) return;
    
    setLoading(true);
    try {
      const [detailsData, creditsData] = await Promise.all([
        movie.type === 'movie' 
          ? tmdbService.getMovieDetails(movie.id)
          : tmdbService.getTVDetails(movie.id),
        movie.type === 'movie'
          ? tmdbService.getMovieCredits(movie.id)
          : tmdbService.getTVCredits(movie.id)
      ]);
      
      setDetails(detailsData);
      setCast(creditsData.cast?.slice(0, 6) || []);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareMovie = () => {
    if (!movie) return;
    const text = `🎬✨ Descobri "${movie.title}" no Cinemind AI e acho que você vai adorar!\n\n${movie.overview}\n\n⭐ Nota: ${movie.vote_average}/10\n\nDescubra sua próxima obsessão: https://cinemind-ai.lovable.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getPlatformInfo = (platforms: string[] = []) => {
    const platformMap: { [key: string]: { name: string; color: string } } = {
      netflix: { name: 'Netflix', color: 'bg-red-600' },
      prime: { name: 'Prime Video', color: 'bg-blue-600' },
      disney: { name: 'Disney+', color: 'bg-indigo-600' },
      hbo: { name: 'HBO Max', color: 'bg-purple-600' },
      paramount: { name: 'Paramount+', color: 'bg-blue-500' }
    };
    return platforms.map(p => platformMap[p]).filter(Boolean);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Backdrop Image */}
          {details?.backdrop_path && (
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img
                src={tmdbService.getImageUrl(details.backdrop_path, 'w1280')}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Poster */}
            <div className="md:col-span-1">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 mb-4 text-slate-300">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                {details?.release_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(details.release_date).getFullYear()}</span>
                  </div>
                )}
                {details?.runtime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatRuntime(details.runtime)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {details?.genres && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              <p className="text-slate-300 mb-6 leading-relaxed">{movie.overview}</p>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Elenco Principal</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cast.map((actor) => (
                      <div key={actor.id} className="text-slate-300 text-sm">
                        <span className="font-medium">{actor.name}</span>
                        {actor.character && (
                          <span className="text-slate-400"> como {actor.character}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {movie.platforms && movie.platforms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Disponível em:</h3>
                  <div className="flex flex-wrap gap-2">
                    {getPlatformInfo(movie.platforms).map((platform, index) => (
                      <span
                        key={index}
                        className={`${platform.color} text-white px-3 py-2 rounded-lg text-sm font-medium`}
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onWatchTrailer(movie)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver Trailer
                </button>
                
                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`${
                    isFavorite(movie.id)
                      ? 'bg-gradient-to-r from-pink-600 to-pink-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  } text-white font-bold py-3 px-6 rounded-xl flex items-center magic-button`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite(movie.id) ? 'fill-current' : ''}`} />
                  {isFavorite(movie.id) ? 'Favoritado' : 'Favoritar'}
                </button>
                
                <button
                  onClick={shareMovie}
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
    </div>
  );
};

export default MovieDetailsModal;
