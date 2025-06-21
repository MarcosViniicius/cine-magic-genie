
import { useState, useEffect } from 'react';
import { MovieRecommendation } from '../types/cinema';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<MovieRecommendation[]>([]);
  const [history, setHistory] = useState<MovieRecommendation[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = () => {
    try {
      const savedFavorites = localStorage.getItem('cinemind-favorites');
      const savedHistory = localStorage.getItem('cinemind-history');
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    }
  };

  const saveToStorage = (key: string, data: MovieRecommendation[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  };

  const addToFavorites = (movie: MovieRecommendation) => {
    const newFavorites = [...favorites, movie];
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
    const newHistory = [movie, ...history.filter(h => h.id !== movie.id)].slice(0, 50);
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

  return {
    favorites,
    history,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToHistory,
    clearHistory,
    clearFavorites
  };
};
