import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ARTICLES } from '../data/mockData';
import { Article } from '../types';
import { BookOpen, HelpCircle, CheckCircle, AlertCircle, Award, Clock } from 'lucide-react';

interface DailyArticlesProps {
  onEarnPoints: (points: number, source: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export default function DailyArticles({ onEarnPoints, onUnlockBadge }: DailyArticlesProps) {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(INITIAL_ARTICLES[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const handleReadArticle = (id: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === id && !art.read) {
        return { ...art, read: true };
      }
      return art;
    }));
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (quizFeedback || !selectedArticle) return;
    setSelectedAnswer(optionIdx);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !selectedArticle) return;

    const isCorrect = selectedAnswer === selectedArticle.quiz?.correctAnswerIndex;
    
    if (isCorrect) {
      setQuizFeedback({
        isCorrect: true,
        text: `Benar Sekali! ${selectedArticle.quiz?.explanation}`
      });

      // Earn points for correct answer
      onEarnPoints(25, `Kuis Edukasi: ${selectedArticle.title}`);

      // Mark quiz as solved for this article
      setArticles(prev => prev.map(art => {
        if (art.id === selectedArticle.id) {
          return { ...art, quizSolved: true };
        }
        return art;
      }));

      // Count solved quizes for badges
      const solvedCount = articles.filter(art => art.quizSolved || art.id === selectedArticle.id).length;
      if (solvedCount >= 3) {
        onUnlockBadge('b5'); // Pembaca Setia
      }
    } else {
      setQuizFeedback({
        isCorrect: false,
        text: 'Maaf, jawaban kurang tepat. Baca kembali materi di atas dan coba lagi ya!'
      });
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setQuizFeedback(null);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="daily-articles-container">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
          📚 Artikel Edukasi Hijau Harian
        </h2>
        <p className="text-[#8a9a8c] text-sm mt-1">
          Perdalam wawasan Anda mengenai pelestarian lingkungan, selesaikan kuis harian, dan kumpulkan koin poin reward.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left column: Article List */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {articles.map((art) => {
            const isSelected = selectedArticle?.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art);
                  handleReadArticle(art.id);
                  setSelectedAnswer(null);
                  setQuizFeedback(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#f0f4ef]/40 border-[#4a6d4d]/30'
                    : 'bg-white border-[#edf1eb] hover:border-[#ccd5cb] hover:bg-[#f9fbf8]/40'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-[#f0f4ef] text-[#4a6d4d] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                    {art.category}
                  </span>
                  <span className="text-[#8a9a8c] font-mono flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> {art.readTime}
                  </span>
                </div>
                
                <h4 className="font-bold text-[#1a2e1d] font-display text-xs tracking-tight mt-2.5 leading-snug">
                  {art.title}
                </h4>
                <p className="text-[10px] text-[#8a9a8c] mt-1.5 line-clamp-2 leading-relaxed font-medium">
                  {art.excerpt}
                </p>

                <div className="flex gap-1.5 mt-3 items-center">
                  {art.read && (
                    <span className="text-[9px] bg-[#f0f4ef] text-[#4a6d4d] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      ✓ Dibaca
                    </span>
                  )}
                  {art.quizSolved && (
                    <span className="text-[9px] bg-[#fcf8e3] text-[#b47c5d] px-2 py-0.5 rounded font-bold">
                      ★ Kuis Selesai (+25p)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Active Article View & Quiz */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <motion.div
                key={selectedArticle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#f9fbf8]/50 border border-[#e5e9e2] p-6 md:p-8 rounded-[32px] shadow-2xs"
              >
                {/* Article Header */}
                <div className="border-b border-[#e5e9e2] pb-4">
                  <span className="text-[10px] bg-[#f0f4ef] text-[#4a6d4d] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a2e1d] font-display tracking-tight mt-3 leading-snug">
                    {selectedArticle.title}
                  </h3>
                </div>

                {/* Article Body */}
                <div className="py-6 border-b border-[#e5e9e2] text-xs md:text-sm text-[#2d3a2e] leading-relaxed space-y-4 font-sans whitespace-pre-wrap font-medium">
                  {selectedArticle.content}
                </div>

                {/* Quiz Section */}
                {selectedArticle.quiz && (
                  <div className="mt-6 bg-white border border-[#e5e9e2] rounded-[24px] p-5 md:p-6 shadow-sm">
                    <h4 className="font-bold text-[#1a2e1d] font-display text-sm tracking-tight flex items-center gap-2 mb-4">
                      <HelpCircle className="w-5 h-5 text-[#4a6d4d]" />
                      Kuis Pemahaman Lingkungan (+25 Poin)
                    </h4>

                    {selectedArticle.quizSolved ? (
                      <div className="bg-[#f0f4ef] border border-[#ccd5cb] text-[#4a6d4d] p-4 rounded-xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4a6d4d] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-sm">Selamat, Kuis Selesai!</span>
                          <p className="text-xs mt-1 leading-relaxed text-[#4a6d4d]">
                            {selectedArticle.quiz.explanation}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="font-bold text-[#1a2e1d] font-display text-xs md:text-sm leading-relaxed">
                          {selectedArticle.quiz.question}
                        </p>

                        <div className="space-y-2">
                          {selectedArticle.quiz.options.map((opt, idx) => {
                            const isChosen = selectedAnswer === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectAnswer(idx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-3 ${
                                  isChosen
                                    ? 'bg-[#f0f4ef]/40 border-[#4a6d4d] ring-1 ring-[#4a6d4d]/20 font-bold text-[#1a2e1d]'
                                    : 'bg-[#f9fbf8] hover:bg-[#f0f4ef]/50 border-[#edf1eb] text-[#2d3a2e] font-medium'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isChosen ? 'bg-[#4a6d4d] text-white' : 'bg-[#f0f4ef] text-[#4a6d4d]'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizFeedback ? (
                          <div className={`p-4 rounded-xl flex items-start gap-3 mt-3 text-xs leading-relaxed ${
                            quizFeedback.isCorrect 
                              ? 'bg-[#f0f4ef] text-[#4a6d4d] border border-[#ccd5cb]' 
                              : 'bg-[#fcf5f2] text-[#b47c5d] border border-[#f3e1d8]'
                          }`}>
                            {quizFeedback.isCorrect ? (
                              <CheckCircle className="w-4.5 h-4.5 text-[#4a6d4d] shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4.5 h-4.5 text-[#b47c5d] shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold block">{quizFeedback.isCorrect ? 'Luar Biasa!' : 'Kurang Tepat'}</span>
                              <p className="mt-1 font-medium">{quizFeedback.text}</p>
                              {!quizFeedback.isCorrect && (
                                <button
                                  onClick={handleTryAgain}
                                  className="mt-2 text-[10px] font-bold text-[#b47c5d] underline cursor-pointer hover:text-[#9a6447]"
                                >
                                  Coba Lagi
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={selectedAnswer === null}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                              selectedAnswer === null
                                ? 'bg-[#f0f4ef]/80 text-[#8a9a8c] cursor-not-allowed'
                                : 'bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white shadow-md cursor-pointer'
                            }`}
                          >
                            Kirim Jawaban Anda
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-20 text-[#8a9a8c] font-medium">
                Pilih artikel dari daftar sebelah kiri untuk mulai membaca.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
