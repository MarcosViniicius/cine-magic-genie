
import React, { useState } from 'react';
import { ArrowRight, Heart, Zap, Smile, Eye, Compass, Star } from 'lucide-react';
import { QuizAnswers } from '../types/cinema';

interface QuizStepProps {
  onComplete: (answers: QuizAnswers) => void;
}

const QuizStep: React.FC<QuizStepProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const questions = [
    {
      id: 'mood',
      question: 'Para qual tipo de aventura seu coração chama hoje?',
      subtitle: 'Deixe suas emoções guiarem a escolha',
      options: [
        { value: 'action', label: 'Ação', icon: Zap, emoji: '💥', description: 'Adrenalina pura!' },
        { value: 'drama', label: 'Drama', icon: Heart, emoji: '🎭', description: 'Emoções profundas' },
        { value: 'comedy', label: 'Comédia', icon: Smile, emoji: '😂', description: 'Risadas garantidas' },
        { value: 'suspense', label: 'Suspense', icon: Eye, emoji: '🤫', description: 'Mistério e tensão' }
      ]
    },
    {
      id: 'experience',
      question: 'Que tipo de experiência você busca?',
      subtitle: 'Cada filme é uma jornada única',
      options: [
        { value: 'laugh', label: 'Rir muito', icon: Smile, emoji: '😄', description: 'Comédia de qualidade' },
        { value: 'thrill', label: 'Sentir emoção', icon: Zap, emoji: '⚡', description: 'Adrenalina total' },
        { value: 'inspire', label: 'Me inspirar', icon: Star, emoji: '✨', description: 'Histórias motivadoras' },
        { value: 'escape', label: 'Escapar da realidade', icon: Compass, emoji: '🌟', description: 'Mundos fantásticos' }
      ]
    },
    {
      id: 'timeframe',
      question: 'Quanto tempo você tem para esta experiência?',
      subtitle: 'Vamos encontrar o ritmo perfeito',
      options: [
        { value: 'quick', label: 'Algo rápido', icon: Zap, emoji: '⚡', description: '30-90 minutos' },
        { value: 'normal', label: 'Tempo normal', icon: Star, emoji: '🎬', description: '90-150 minutos' },
        { value: 'long', label: 'Tenho tempo de sobra', icon: Compass, emoji: '🕰️', description: '150+ minutos' },
        { value: 'series', label: 'Quero uma série', icon: Heart, emoji: '📺', description: 'Vários episódios' }
      ]
    },
    {
      id: 'company',
      question: 'Quem vai compartilhar esta experiência com você?',
      subtitle: 'A companhia faz toda a diferença',
      options: [
        { value: 'alone', label: 'Só eu', icon: Star, emoji: '🧘', description: 'Momento pessoal' },
        { value: 'partner', label: 'Meu par', icon: Heart, emoji: '💕', description: 'Momento romântico' },
        { value: 'friends', label: 'Amigos', icon: Smile, emoji: '👥', description: 'Diversão em grupo' },
        { value: 'family', label: 'Família', icon: Compass, emoji: '👨‍👩‍👧‍👦', description: 'Para todos' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      setTimeout(() => {
        onComplete(newAnswers);
      }, 500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Conjurando recomendações...</span>
            <span className="text-slate-400">{currentQuestion + 1} de {questions.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentQ.question}
          </h2>
          <p className="text-xl text-slate-300">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {currentQ.options.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(currentQ.id, option.value)}
                className="quiz-option text-left group"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{option.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{option.label}</h3>
                    <p className="text-slate-300">{option.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Skip Button */}
        <div className="mt-12">
          <button
            onClick={() => handleAnswerSelect(currentQ.id, '')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Pular esta pergunta →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
