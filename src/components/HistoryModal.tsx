
import React from 'react';
import { X, History, Star, Calendar, Trash2, Clock } from 'lucide-react';
import { MovieRecommendation } from '../types/cinema';
import { useFavorites } from '../hooks/useFavorites';
import { tmdbService } from '../services/tmdbService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieSelect: (movie: MovieRecommendation) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onMovieSelect 
}) => {
  const { history, clearHistory } = useFavorites();

  if (!isOpen) return null;

  const handleMovieClick = (movie: MovieRecommendation) => {
    onMovieSelect(movie);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Histórico</h3>
              <p className="text-slate-400 text-sm">{history.length} filmes visualizados</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
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
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Nenhum histórico ainda</h4>
              <p className="text-slate-400">
                Explore filmes e séries para ver seu histórico aqui
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex gap-4"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={tmdbService.getImageUrl(movie.poster_path, 'w200')}
                      alt={movie.title}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold line-clamp-1 flex-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-slate-400 ml-4">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(movie.viewedAt || new Date().toISOString())}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
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

export default HistoryModal;
