
import React from 'react';
import { X, Heart, Star, Calendar, Trash2 } from 'lucide-react';
import { MovieRecommendation } from '../types/cinema';
import { useFavorites } from '../hooks/useFavorites';
import { tmdbService } from '../services/tmdbService';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieSelect: (movie: MovieRecommendation) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  isOpen, 
  onClose, 
  onMovieSelect 
}) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  if (!isOpen) return null;

  const handleMovieClick = (movie: MovieRecommendation) => {
    onMovieSelect(movie);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Meus Favoritos</h3>
              <p className="text-slate-400 text-sm">{favorites.length} filmes salvos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Nenhum favorito ainda</h4>
              <p className="text-slate-400">
                Adicione filmes aos seus favoritos para vê-los aqui
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="relative">
                    <img
                      src={tmdbService.getImageUrl(movie.poster_path, 'w300')}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(movie.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-2 line-clamp-2">
                      {movie.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
