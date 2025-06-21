
import { useState, useEffect } from 'react';
import { MovieRecommendation } from '../types/cinema';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<MovieRecommendation[]>([]);
  const [history, setHistory] = useState<MovieRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = () => {
    setIsLoading(true);
    try {
      const savedFavorites = localStorage.getItem('cinemind-favorites');
      const savedHistory = localStorage.getItem('cinemind-history');
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      }
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
      // Reset em caso de dados corrompidos
      localStorage.removeItem('cinemind-favorites');
      localStorage.removeItem('cinemind-history');
      setFavorites([]);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToStorage = (key: string, data: MovieRecommendation[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
      // Tentar limpar storage se estiver cheio
      if (error instanceof Error && error.message.includes('QuotaExceededError')) {
        console.warn('Storage quota exceeded, clearing old data...');
        clearOldData();
      }
    }
  };

  const clearOldData = () => {
    try {
      // Manter apenas os 20 favoritos mais recentes e 30 itens do histórico
      const trimmedFavorites = favorites.slice(0, 20);
      const trimmedHistory = history.slice(0, 30);
      
      localStorage.setItem('cinemind-favorites', JSON.stringify(trimmedFavorites));
      localStorage.setItem('cinemind-history', JSON.stringify(trimmedHistory));
      
      setFavorites(trimmedFavorites);
      setHistory(trimmedHistory);
    } catch (error) {
      console.error('Erro ao limpar dados antigos:', error);
    }
  };

  const addToFavorites = (movie: MovieRecommendation) => {
    const movieWithTimestamp = {
      ...movie,
      favoriteAt: new Date().toISOString()
    };
    
    const newFavorites = [movieWithTimestamp, ...favorites.filter(f => f.id !== movie.id)];
    setFavorites(newFavorites);
    saveToStorage('cinemind-favorites', newFavorites);
  };

  const removeFromFavorites = (movieId: number) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);
    saveToStorage('cinemind-favorites', newFavorites);
  };

  const toggleFavorite = (movie: MovieRecommendation) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const addToHistory = (movie: MovieRecommendation) => {
    const movieWithTimestamp = {
      ...movie,
      viewedAt: new Date().toISOString()
    };
    
    // Remove duplicatas e adiciona no início, limitando a 50 itens
    const newHistory = [
      movieWithTimestamp, 
      ...history.filter(h => h.id !== movie.id)
    ].slice(0, 50);
    
    setHistory(newHistory);
    saveToStorage('cinemind-history', newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cinemind-history');
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('cinemind-favorites');
  };

  const getStorageInfo = () => {
    try {
      const favoritesSize = new Blob([localStorage.getItem('cinemind-favorites') || '']).size;
      const historySize = new Blob([localStorage.getItem('cinemind-history') || '']).size;
      return {
        favoritesSize: `${(favoritesSize / 1024).toFixed(2)} KB`,
        historySize: `${(historySize / 1024).toFixed(2)} KB`,
        totalSize: `${((favoritesSize + historySize) / 1024).toFixed(2)} KB`
      };
    } catch (error) {
      return { favoritesSize: 'N/A', historySize: 'N/A', totalSize: 'N/A' };
    }
  };

  return {
    favorites,
    history,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToHistory,
    clearHistory,
    clearFavorites,
    getStorageInfo
  };
};
