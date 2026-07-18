import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_TRASH_ITEMS } from '../data/mockData';
import { TrashItem } from '../types';
import { Award, RotateCcw, ThumbsUp, AlertCircle, Play, Sparkles } from 'lucide-react';

interface WasteSortingGameProps {
  onEarnPoints: (points: number, source: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export default function WasteSortingGame({ onEarnPoints, onUnlockBadge }: WasteSortingGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string; item: TrashItem } | null>(null);
  const [shuffledItems, setShuffledItems] = useState<TrashItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [perfectGame, setPerfectGame] = useState(true);

  // Initialize and shuffle items
  const startGame = () => {
    const shuffled = [...INITIAL_TRASH_ITEMS].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setShowSummary(false);
    setPerfectGame(true);
    setIsPlaying(true);
  };

  const handleSort = (choice: 'organik' | 'anorganik') => {
    if (feedback || showSummary) return;

    const currentItem = shuffledItems[currentIndex];
    const isCorrect = currentItem.category === choice;

    if (isCorrect) {
      setScore((prev) => prev + currentItem.points);
    } else {
      setPerfectGame(false);
    }

    setFeedback({
      isCorrect,
      text: isCorrect 
        ? `Benar! +${currentItem.points} Poin` 
        : `Ups, Kurang Tepat! Kategori asli: ${currentItem.category.toUpperCase()}`,
      item: currentItem
    });
  };

  const nextItem = () => {
    setFeedback(null);
    if (currentIndex + 1 < shuffledItems.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      // Award earned points to main profile
      onEarnPoints(score, 'Game Sortir EcoQuest');
      if (perfectGame && score > 0) {
        onUnlockBadge('b1'); // Prajurit Organik
      }
      onUnlockBadge('b4'); // Penyortir Ulung badge (unlocked by playing)
    }
  };

  const activeItem = shuffledItems[currentIndex];

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="waste-sorting-game-container">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
          🎯 Sortir Sampah EcoQuest
        </h2>
        <p className="text-[#8a9a8c] text-sm mt-1">
          Uji pengetahuan lingkunganmu! Seret atau pilih tempat yang benar untuk setiap item sampah.
        </p>
      </div>

      {!isPlaying ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 bg-[#f0f4ef]/50 rounded-[24px] border border-dashed border-[#ccd5cb]">
          <div className="w-16 h-16 bg-[#f0f4ef] rounded-2xl flex items-center justify-center text-[#4a6d4d] mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2e1d] font-display">Mulai Bersihkan Bumi!</h3>
          <p className="text-[#8a9a8c] text-sm max-w-sm mt-2 mb-6 font-medium">
            Bedakan sampah organik (mudah membusuk/kompos) dan anorganik (plastik, kertas, kaca, logam) untuk mengumpulkan skor tertinggi.
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#4a6d4d] text-white font-bold rounded-xl hover:bg-[#3d5a3f] transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            id="start-sorting-game-btn"
          >
            <Play className="w-5 h-5 fill-white" /> Mulai Bermain
          </button>
        </div>
      ) : showSummary ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-20 h-20 bg-[#f0f4ef] rounded-full flex items-center justify-center text-[#4a6d4d] mb-4 relative">
            <Award className="w-10 h-10" />
            <motion.div 
              className="absolute inset-0 border border-[#4a6d4d] rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <h3 className="text-2xl font-bold text-[#1a2e1d] font-display">Selesai Beraksi!</h3>
          <p className="text-[#8a9a8c] mt-2 max-w-md font-medium">
            Hebat! Kamu telah menyortir semua sampah dengan dedikasi penuh.
          </p>
          
          <div className="my-6 bg-[#f9fbf8] rounded-[24px] p-6 border border-[#e5e9e2] w-full max-w-sm">
            <div className="text-[#8a9a8c] text-xs font-mono tracking-wider uppercase">Poin Dikumpulkan</div>
            <div className="text-4xl font-extrabold text-[#4a6d4d] mt-1">{score} Poin</div>
            <div className="text-xs text-[#2d3a2e] mt-3 flex items-center justify-center gap-2 font-medium">
              {perfectGame ? (
                <span className="bg-[#f0f4ef] text-[#4a6d4d] px-3 py-1 rounded-full font-bold">✨ Skor Sempurna! Unlocked Lencana 'Prajurit Organik'</span>
              ) : (
                <span>Lencana 'Penyortir Ulung' Berhasil Diperoleh!</span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-[#4a6d4d] text-white font-bold rounded-xl hover:bg-[#3d5a3f] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              id="replay-sorting-game-btn"
            >
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          {/* Progress bar */}
          <div className="w-full bg-[#f0f4ef] rounded-full h-2.5 mb-6 overflow-hidden">
            <div 
              className="bg-[#4a6d4d] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex) / shuffledItems.length) * 100}%` }}
            />
          </div>

          {/* Current Score Indicator */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono bg-[#f0f4ef] text-[#4a6d4d] px-3 py-1 rounded-full font-bold">
              Item {currentIndex + 1} dari {shuffledItems.length}
            </span>
            <span className="text-sm font-bold text-[#4a6d4d] font-display">
              Skor: {score} Poin
            </span>
          </div>

          {/* Core game area */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-md bg-[#f9fbf8] border border-[#e5e9e2] p-6 rounded-[24px] flex flex-col items-center shadow-xs"
                >
                  <div className="text-5xl mb-4">{feedback.item.icon}</div>
                  <div className={`text-lg font-bold flex items-center gap-2 mb-2 ${feedback.isCorrect ? 'text-[#4a6d4d]' : 'text-[#b47c5d]'}`}>
                    {feedback.isCorrect ? <ThumbsUp className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {feedback.text}
                  </div>
                  <h4 className="font-bold text-[#1a2e1d] text-center mb-1 font-display">{feedback.item.name}</h4>
                  <p className="text-[#8a9a8c] text-xs text-center max-w-xs mb-3 font-medium">{feedback.item.description}</p>
                  
                  <div className="bg-white border border-[#e5e9e2] p-4 rounded-xl w-full text-left text-xs mb-4 shadow-2xs">
                    <span className="font-bold text-[#1a2e1d] block mb-1">💡 Cara Daur Ulang Terbaik:</span>
                    <p className="text-[#2d3a2e] leading-relaxed font-sans">{feedback.item.recyclingMethod}</p>
                  </div>

                  <button
                    onClick={nextItem}
                    className="w-full py-2.5 bg-[#4a6d4d] text-white text-xs font-bold rounded-xl hover:bg-[#3d5a3f] transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Lanjut
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-32 h-32 bg-[#f0f4ef] rounded-full border-4 border-dashed border-[#ccd5cb] flex items-center justify-center mb-5 select-none shadow-inner">
                    <span className="text-5xl">{activeItem.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a2e1d] tracking-tight font-display">{activeItem.name}</h3>
                  <span className="text-xs text-[#8a9a8c] mt-1.5 font-mono font-medium">Nilai misi: +{activeItem.points} XP jika disortir dengan benar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Sorting Bins */}
          {!feedback && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleSort('organik')}
                className="group p-5 bg-[#e8efea] hover:bg-[#dee9e1] border-b-8 border-[#4a6d4d] rounded-t-2xl rounded-b-md text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-sm"
                id="organik-bin-btn"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">🥬</span>
                <span className="font-bold text-[#4a6d4d] text-base uppercase tracking-wider">Organik</span>
                <span className="text-[10px] text-[#4a6d4d] font-semibold leading-tight opacity-90">Sisa makanan, tanaman, bahan alami</span>
              </button>

              <button
                onClick={() => handleSort('anorganik')}
                className="group p-5 bg-[#f4f0ef] hover:bg-[#eae1de] border-b-8 border-[#b47c5d] rounded-t-2xl rounded-b-md text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-sm"
                id="anorganik-bin-btn"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">🧴</span>
                <span className="font-bold text-[#b47c5d] text-base uppercase tracking-wider">Anorganik</span>
                <span className="text-[10px] text-[#b47c5d] font-semibold leading-tight opacity-90">Plastik, kertas, kaca, kemasan</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
