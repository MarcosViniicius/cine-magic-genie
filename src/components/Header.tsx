
import React, { useState } from 'react';
import { Menu, Heart, History, Star, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenFavorites: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenFavorites, onOpenHistory, onOpenSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cinemind AI</h1>
            <p className="text-xs text-slate-400">Seu Cine-Gênio pessoal</p>
          </div>
        </div>

        {/* Menu Hambúrguer */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          {/* Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => {
                  onOpenFavorites();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Favoritos</span>
              </button>
              <button
                onClick={() => {
                  onOpenHistory();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
              >
                <History className="w-4 h-4 text-blue-400" />
                <span>Histórico</span>
              </button>
              <button
                onClick={() => {
                  onOpenSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configurações</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
