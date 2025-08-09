import React, { useState } from "react";
import { Star, Sparkles, Wand2, Film, Search, Settings } from "lucide-react";
import QuizStep from "../components/QuizStep";
import FiltersStep from "../components/FiltersStep";
import ResultsStep from "../components/ResultsStep";
import Header from "../components/Header";
import SupportModal from "../components/SupportModal";
import SupportModalSimple from "../components/SupportModalSimple";
import SimpleModal from "../components/SimpleModal";
import UltraSimpleModal from "../components/UltraSimpleModal";
import SupportButton from "../components/SupportButton";
import FavoritesModal from "../components/FavoritesModal";
import HistoryModal from "../components/HistoryModal";
import SettingsModal from "../components/SettingsModal";
import MovieDetailsModal from "../components/MovieDetailsModal";
import TrailerModal from "../components/TrailerModal";
import {
  QuizAnswers,
  MovieFilters,
  MovieRecommendation,
} from "../types/cinema";
import { useFavorites } from "../hooks/useFavorites";
import { tmdbService } from "../services/tmdbService";
import { useToast } from "../hooks/use-toast";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "quiz" | "filters" | "results"
  >("welcome");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [filters, setFilters] = useState<MovieFilters>({});
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showUltraSimpleModal, setShowUltraSimpleModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] =
    useState<MovieRecommendation | null>(null);
  const [trailerModal, setTrailerModal] = useState<{
    isOpen: boolean;
    videoKey: string;
    title: string;
  }>({
    isOpen: false,
    videoKey: "",
    title: "",
  });

  const { addToHistory } = useFavorites();
  const { toast } = useToast();

  const handleStartJourney = () => {
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setCurrentStep("filters");
  };

  const handleFiltersComplete = (userFilters: MovieFilters) => {
    setFilters(userFilters);
    setCurrentStep("results");
  };

  const handleNewSearch = () => {
    setCurrentStep("quiz");
    setQuizAnswers({});
    setFilters({});
  };

  const handleOpenFavorites = () => {
    setShowFavoritesModal(true);
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSupportClick = () => {
    console.log("Support clicked, setting modal to true");
    console.log("Current showSupportModal state:", showSupportModal);
    setShowSupportModal(true);
    console.log("After setShowSupportModal(true)");

    // Verificar se o estado mudou após um delay
    setTimeout(() => {
      console.log("showSupportModal state after timeout:", showSupportModal);
    }, 100);
  };

  const handleMovieSelect = (movie: MovieRecommendation) => {
    setSelectedMovie(movie);
    addToHistory(movie);
    setShowMovieDetailsModal(true);
  };

  const handleWatchTrailer = async (movie: MovieRecommendation) => {
    try {
      const videos =
        movie.type === "movie"
          ? await tmdbService.getMovieVideos(movie.id)
          : await tmdbService.getTVVideos(movie.id);

      const trailer = videos.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerModal({
          isOpen: true,
          videoKey: trailer.key,
          title: movie.title,
        });
      } else {
        toast({
          title: "Trailer não encontrado",
          description:
            "Infelizmente não conseguimos encontrar um trailer para este título.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar trailer:", error);
      toast({
        title: "Erro ao carregar trailer",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  if (currentStep === "quiz") {
    return (
      <div className="min-h-screen">
        <Header
          onOpenFavorites={handleOpenFavorites}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
        />
        <div className="pt-20">
          <QuizStep onComplete={handleQuizComplete} />
        </div>
        <SupportButton onClick={handleSupportClick} />
        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
        {selectedMovie && (
          <MovieDetailsModal
            isOpen={showMovieDetailsModal}
            onClose={() => setShowMovieDetailsModal(false)}
            movie={selectedMovie}
            onWatchTrailer={handleWatchTrailer}
          />
        )}
        <TrailerModal
          isOpen={trailerModal.isOpen}
          onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
          videoKey={trailerModal.videoKey}
          title={trailerModal.title}
        />
      </div>
    );
  }

  if (currentStep === "filters") {
    return (
      <div className="min-h-screen">
        <Header
          onOpenFavorites={handleOpenFavorites}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
        />
        <div className="pt-20">
          <FiltersStep
            quizAnswers={quizAnswers}
            onComplete={handleFiltersComplete}
          />
        </div>
        <SupportButton onClick={handleSupportClick} />
        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
        {selectedMovie && (
          <MovieDetailsModal
            isOpen={showMovieDetailsModal}
            onClose={() => setShowMovieDetailsModal(false)}
            movie={selectedMovie}
            onWatchTrailer={handleWatchTrailer}
          />
        )}
        <TrailerModal
          isOpen={trailerModal.isOpen}
          onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
          videoKey={trailerModal.videoKey}
          title={trailerModal.title}
        />
      </div>
    );
  }

  if (currentStep === "results") {
    return (
      <div className="min-h-screen">
        <Header
          onOpenFavorites={handleOpenFavorites}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
        />
        <div className="pt-20">
          <ResultsStep
            quizAnswers={quizAnswers}
            filters={filters}
            onNewSearch={handleNewSearch}
          />
        </div>
        <SupportButton onClick={handleSupportClick} />
        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onMovieSelect={handleMovieSelect}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
        {selectedMovie && (
          <MovieDetailsModal
            isOpen={showMovieDetailsModal}
            onClose={() => setShowMovieDetailsModal(false)}
            movie={selectedMovie}
            onWatchTrailer={handleWatchTrailer}
          />
        )}
        <TrailerModal
          isOpen={trailerModal.isOpen}
          onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
          videoKey={trailerModal.videoKey}
          title={trailerModal.title}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        onOpenFavorites={handleOpenFavorites}
        onOpenHistory={handleOpenHistory}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main Content */}
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Magical Header */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
            </div>
            <div className="relative">
              <Wand2 className="w-20 h-20 mx-auto mb-6 text-yellow-400 genie-sparkle" />
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Cinemind AI
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8">
                Seu Cine-Gênio pessoal para descobrir a magia perfeita
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-slate-600">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-3 genie-sparkle" />
              <h2 className="text-2xl font-semibold text-white">
                Bem-vindo à Experiência Cinematográfica Mágica!
              </h2>
              <Sparkles className="w-8 h-8 text-yellow-400 ml-3 genie-sparkle" />
            </div>
            <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Esfregue a lâmpada mágica dos seus gostos e deixe nosso Cine-Gênio
              descobrir o filme, série ou anime perfeito para o seu momento. Uma
              jornada única de descoberta cinematográfica te aguarda!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-pink-800/30 to-pink-600/30 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:-translate-y-1">
              <Search className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Quiz Mágico
              </h3>
              <p className="text-slate-300">
                Perguntas divertidas que revelam seus gostos únicos
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-800/30 to-purple-600/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1">
              <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Filtros Inteligentes
              </h3>
              <p className="text-slate-300">
                Refine sua busca com precisão cinematográfica
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-800/30 to-blue-600/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1">
              <Film className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Resultados Mágicos
              </h3>
              <p className="text-slate-300">
                Recomendações personalizadas que surpreendem
              </p>
            </div>
          </div>

          {/* Start Journey Button */}
          <button
            onClick={handleStartJourney}
            className="group bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl magic-button cinema-glow"
          >
            <div className="flex items-center">
              <Star className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Iniciar Jornada Mágica
              <Sparkles className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
            </div>
          </button>

          {/* Test Modal Button */}

          {/* Footer Magic */}
          <div className="mt-16 text-slate-400 text-sm">
            <p>
              ✨ Preparado para descobrir sua próxima obsessão cinematográfica?
              ✨
            </p>
          </div>
        </div>
      </div>

      {/* All Modals */}
      <SupportButton onClick={handleSupportClick} />
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <SimpleModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
      />
      <SimpleModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
      />
      <UltraSimpleModal
        isOpen={showUltraSimpleModal}
        onClose={() => setShowUltraSimpleModal(false)}
      />
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        onMovieSelect={handleMovieSelect}
      />
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onMovieSelect={handleMovieSelect}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      {selectedMovie && (
        <MovieDetailsModal
          isOpen={showMovieDetailsModal}
          onClose={() => setShowMovieDetailsModal(false)}
          movie={selectedMovie}
          onWatchTrailer={handleWatchTrailer}
        />
      )}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
        videoKey={trailerModal.videoKey}
        title={trailerModal.title}
      />
    </div>
  );
};

export default Index;
