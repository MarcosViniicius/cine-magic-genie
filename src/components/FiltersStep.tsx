
import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, Star, Tv, Globe, Filter } from 'lucide-react';
import { QuizAnswers, MovieFilters } from '../types/cinema';

interface FiltersStepProps {
  quizAnswers: QuizAnswers;
  onComplete: (filters: MovieFilters) => void;
}

const FiltersStep: React.FC<FiltersStepProps> = ({ quizAnswers, onComplete }) => {
  const [filters, setFilters] = useState<MovieFilters>({
    duration: [60, 180],
    year: [2000, 2024],
    rating: 6.0,
    platforms: [],
    language: 'any',
    type: 'all'
  });

  const platforms = [
    { id: 'netflix', name: 'Netflix', color: 'bg-red-600' },
    { id: 'prime', name: 'Prime Video', color: 'bg-blue-600' },
    { id: 'disney', name: 'Disney+', color: 'bg-indigo-600' },
    { id: 'hbo', name: 'HBO Max', color: 'bg-purple-600' },
    { id: 'paramount', name: 'Paramount+', color: 'bg-blue-500' },
    { id: 'apple', name: 'Apple TV+', color: 'bg-gray-600' }
  ];

  const languages = [
    { id: 'any', name: 'Qualquer idioma' },
    { id: 'pt', name: 'Português' },
    { id: 'en', name: 'Inglês' },
    { id: 'es', name: 'Espanhol' },
    { id: 'fr', name: 'Francês' },
    { id: 'ja', name: 'Japonês' },
    { id: 'ko', name: 'Coreano' }
  ];

  const contentTypes = [
    { id: 'all', name: 'Tudo', icon: Star, emoji: '🎬' },
    { id: 'movie', name: 'Filmes', icon: Star, emoji: '🎭' },
    { id: 'series', name: 'Séries', icon: Tv, emoji: '📺' },
    { id: 'anime', name: 'Animes', icon: Star, emoji: '🍜' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    const currentPlatforms = filters.platforms || [];
    const updatedPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter(p => p !== platformId)
      : [...currentPlatforms, platformId];
    
    setFilters({ ...filters, platforms: updatedPlatforms });
  };

  const handleSubmit = () => {
    onComplete(filters);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Filter className="w-16 h-16 mx-auto mb-6 text-purple-400 genie-sparkle" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refinando a Magia
          </h2>
          <p className="text-xl text-slate-300">
            Ajuste os controles da máquina cinematográfica perfeita
          </p>
        </div>

        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-600">
          {/* Content Type */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Tipo de Conteúdo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilters({ ...filters, type: type.id as any })}
                  className={`p-4 rounded-xl border transition-all ${
                    filters.type === type.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-lg'
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.emoji}</div>
                  <div className="text-white font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-green-400" />
              Duração (minutos)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 w-12">{filters.duration?.[0] || 60}</span>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={filters.duration?.[0] || 60}
                  onChange={(e) => setFilters({
                    ...filters,
                    duration: [parseInt(e.target.value), filters.duration?.[1] || 180]
                  })}
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={filters.duration?.[1] || 180}
                  onChange={(e) => setFilters({
                    ...filters,
                    duration: [filters.duration?.[0] || 60, parseInt(e.target.value)]
                  })}
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-slate-300 w-12">{filters.duration?.[1] || 180}</span>
              </div>
            </div>
          </div>

          {/* Year Range */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-400" />
              Período
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">De</label>
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={filters.year?.[0] || 2000}
                  onChange={(e) => setFilters({
                    ...filters,
                    year: [parseInt(e.target.value), filters.year?.[1] || 2024]
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Até</label>
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={filters.year?.[1] || 2024}
                  onChange={(e) => setFilters({
                    ...filters,
                    year: [filters.year?.[0] || 2000, parseInt(e.target.value)]
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Nota Mínima: {filters.rating}/10
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={filters.rating || 6.0}
              onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Platforms */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Tv className="w-6 h-6 mr-3 text-red-400" />
              Plataformas de Streaming
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    filters.platforms?.includes(platform.id)
                      ? `${platform.color} border-transparent shadow-lg`
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-white font-medium">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-cyan-400" />
              Idioma
            </h3>
            <select
              value={filters.language || 'any'}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-xl magic-button cinema-glow inline-flex items-center"
            >
              Conjurar Recomendações
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersStep;
