
import React from 'react';
import { Heart } from 'lucide-react';

interface SupportButtonProps {
  onClick: () => void;
}

const SupportButton: React.FC<SupportButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('SupportButton clicked');
    // alert('Botão clicado! Modal deve aparecer...');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl magic-button cinema-glow group"
      title="Apoie o projeto"
    >
      <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-12 right-0 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Apoie com R$5
      </span>
    </button>
  );
};

export default SupportButton;
