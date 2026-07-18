import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_BADGES, INITIAL_MISSIONS } from './data/mockData';
import { UserProfile, Badge, DailyMission } from './types';

// Import our modular subcomponents
import WasteSortingGame from './components/WasteSortingGame';
import WasteMap from './components/WasteMap';
import CommunityForum from './components/CommunityForum';
import ProgressTracker from './components/ProgressTracker';
import DailyArticles from './components/DailyArticles';
import RecyclingPlanner from './components/RecyclingPlanner';
import LeaderboardAndBadges from './components/LeaderboardAndBadges';

// Lucide icons
import { 
  Gamepad2, 
  MapPin, 
  MessageSquare, 
  LineChart, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Flame, 
  Bell, 
  Star, 
  Check, 
  Sparkles, 
  CheckCircle2,
  X,
  Menu
} from 'lucide-react';

export default function App() {
  // Global User Profile State
  const [profile, setProfile] = useState<UserProfile>({
    id: 'u-1',
    username: 'EcoHero_Saya',
    email: 'genaisyifa@gmail.com',
    points: 80, // Start with some initial points
    badges: ['b4'], // Pre-unlocked game badge
    level: 1,
    streak: 3,
    weeklyWasteLogged: 1250, // in grams
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [activeTab, setActiveTab] = useState<string>('game');
  
  // Custom interactive notifications state
  const [notifications, setNotifications] = useState<{ id: string; text: string; read: boolean; date: string }[]>([
    { 
      id: 'n-1', 
      text: 'Selamat bergabung di EcoQuest! Selesaikan game sortir sampah pertamamu untuk meraih koin poin perdana.', 
      read: false, 
      date: 'Baru saja' 
    }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Floating score alert toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto calculate user level based on points
  useEffect(() => {
    const computedLevel = Math.floor(profile.points / 100) + 1;
    if (computedLevel !== profile.level) {
      setProfile(prev => ({
        ...prev,
        level: computedLevel
      }));
      triggerToast(`🎉 Naik Level! Anda sekarang Level ${computedLevel}!`);
    }
  }, [profile.points]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleEarnPoints = (amount: number, source: string) => {
    setProfile(prev => ({
      ...prev,
      points: prev.points + amount
    }));
    triggerToast(`🌿 +${amount} Poin dari ${source}!`);

    // Check if we can complete a related daily mission
    if (source.includes('Game')) {
      completeMission('game');
    } else if (source.includes('Reduksi')) {
      completeMission('log');
    } else if (source.includes('Kuis')) {
      completeMission('read');
    } else if (source.includes('Postingan')) {
      completeMission('forum');
    }
  };

  const completeMission = (type: 'game' | 'read' | 'log' | 'forum') => {
    setMissions(prev => prev.map(m => {
      if (m.type === type && m.status === 'available') {
        // Reward points for mission
        setProfile(p => ({ ...p, points: p.points + m.rewardPoints }));
        triggerToast(`🏆 Misi Selesai: "${m.title}"! +${m.rewardPoints} Bonus Poin`);
        return { ...m, status: 'completed' as const };
      }
      return m;
    }));
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (profile.badges.includes(badgeId)) return;

    setProfile(prev => ({
      ...prev,
      badges: [...prev.badges, badgeId]
    }));

    const badgeName = badges.find(b => b.id === badgeId)?.name || 'Lencana Baru';
    triggerToast(`🏅 Lencana Baru Diperoleh: "${badgeName}"!`);
  };

  const handleLogWaste = (org: number, inorg: number) => {
    setProfile(prev => ({
      ...prev,
      weeklyWasteLogged: prev.weeklyWasteLogged + org + inorg
    }));
  };

  const addNotification = (text: string) => {
    const newNotif = {
      id: `n-${Date.now()}`,
      text,
      read: false,
      date: 'Hari ini'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d3a2e] font-sans flex flex-col justify-between selection:bg-[#e5e9e2]" id="ecoquest-app">
      {/* Top Header / HUD */}
      <header className="bg-white border-b border-[#e5e9e2] sticky top-0 z-30 shadow-sm px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4a6d4d] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl text-white">🌱</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-1.5 leading-none">
              EcoQuest <span className="text-[9px] bg-[#4a6d4d] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Zero Waste</span>
            </h1>
            <span className="text-[10px] text-[#8a9a8c] font-medium">Gaya Hidup Minim Sampah & Edukasi</span>
          </div>
        </div>

        {/* User stats HUD */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-[#fffdfa] border border-[#f5ece0] px-3 py-1.5 rounded-xl cursor-help" title="Streak harian perlindungan bumi">
            <Flame className="w-4 h-4 text-[#b47c5d] fill-[#b47c5d]" />
            <span className="text-xs font-bold text-[#b47c5d] font-mono">{profile.streak} Hari</span>
          </div>

          {/* Points display */}
          <div className="flex items-center gap-1.5 bg-[#f0f4ef] border border-[#e5e9e2] px-3.5 py-1.5 rounded-xl">
            <Star className="w-4 h-4 text-[#4a6d4d] fill-[#4a6d4d]" />
            <span className="text-xs font-bold text-[#4a6d4d] font-mono">{profile.points} Poin</span>
          </div>

          {/* Simulated push notifications tray icon */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationCenter(!showNotificationCenter);
                markAllNotificationsAsRead();
              }}
              className="p-2 hover:bg-[#f0f4ef] text-[#2d3a2e] hover:text-[#1a2e1d] rounded-xl transition-colors cursor-pointer relative"
              id="notifications-bell-btn"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#b47c5d] text-[9px] font-black text-white rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            <AnimatePresence>
              {showNotificationCenter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 bg-white border border-[#e5e9e2] rounded-[24px] w-[320px] md:w-[360px] shadow-xl p-5 z-40"
                >
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#e5e9e2] mb-2.5">
                    <h3 className="font-bold text-[#1a2e1d] text-xs uppercase tracking-widest flex items-center gap-1.5">
                      🔔 Pengingat & Info
                    </h3>
                    <button 
                      onClick={() => setShowNotificationCenter(false)}
                      className="text-[#8a9a8c] hover:text-[#1a2e1d] text-xs font-semibold cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-2.5 rounded-xl bg-[#f9fbf8] border border-[#e5e9e2] text-xs">
                          <p className="text-[#2d3a2e] leading-relaxed font-sans">{notif.text}</p>
                          <span className="text-[9px] text-[#8a9a8c] block mt-1 font-mono">{notif.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-[#8a9a8c] text-xs">
                        Tidak ada pengingat saat ini.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Floating score / Level reward toast notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#1a2e1d] text-white text-xs font-semibold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 z-50 text-center border border-[#4a6d4d]"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar menu (left 3 cols) */}
        <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-[#e5e9e2] pr-0 lg:pr-6 scrollbar-thin">
          <div className="hidden lg:block mb-5 pl-2.5">
            <span className="text-[#8a9a8c] text-[10px] font-bold uppercase tracking-widest block">Menu Misi</span>
          </div>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'game' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-game-btn"
          >
            <Gamepad2 className="w-4.5 h-4.5" /> 🎮 Sortir Sampah Game
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tracker' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-tracker-btn"
          >
            <LineChart className="w-4.5 h-4.5" /> 📊 Pelacak Reduksi
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'map' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-map-btn"
          >
            <MapPin className="w-4.5 h-4.5" /> 📍 Peta Daur Ulang
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'forum' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-forum-btn"
          >
            <MessageSquare className="w-4.5 h-4.5" /> 💬 Forum Komunitas
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'articles' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-articles-btn"
          >
            <BookOpen className="w-4.5 h-4.5" /> 📚 Artikel & Kuis
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'planner' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-planner-btn"
          >
            <Calendar className="w-4.5 h-4.5" /> 📅 Jadwal & Pengingat
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leaderboard' 
                ? 'bg-[#4a6d4d] text-white shadow-sm' 
                : 'text-[#2d3a2e] hover:bg-[#f0f4ef] hover:text-[#1a2e1d]'
            }`}
            id="tab-leaderboard-btn"
          >
            <Trophy className="w-4.5 h-4.5" /> 🏆 Lencana & Papan
          </button>
        </nav>

        {/* Core Workspace / tab panels view (right 9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Daily Missions Alert Strip displayed above active view panels */}
          {activeTab !== 'leaderboard' && (
            <div className="bg-[#f0f4ef] border border-[#e5e9e2] p-5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">🎯</span>
                <div>
                  <h4 className="font-bold text-[#1a2e1d] text-xs md:text-sm tracking-tight font-display">Misi Harian EcoQuest</h4>
                  <p className="text-[#8a9a8c] text-[10px] md:text-xs leading-relaxed mt-0.5">Selesaikan tugas harian untuk melipatgandakan poin reward Anda dan menjaga kelestarian bumi!</p>
                </div>
              </div>

              {/* Mini missions checks */}
              <div className="flex flex-wrap gap-2 md:gap-3.5">
                {missions.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-[#e5e9e2] px-3 py-1.5 rounded-xl shadow-xs">
                    {m.status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-[#4a6d4d] stroke-[3px]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ccd5cb]" />
                    )}
                    <span className={m.status === 'completed' ? 'text-[#8a9a8c] line-through' : 'text-[#2d3a2e]'}>
                      {m.title.split(' ')[0]} (+{m.rewardPoints}p)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tab View routing render */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {activeTab === 'game' && (
                  <WasteSortingGame 
                    onEarnPoints={handleEarnPoints} 
                    onUnlockBadge={handleUnlockBadge} 
                  />
                )}

                {activeTab === 'tracker' && (
                  <ProgressTracker 
                    onEarnPoints={handleEarnPoints} 
                    onUnlockBadge={handleUnlockBadge}
                    onLogWaste={handleLogWaste}
                  />
                )}

                {activeTab === 'map' && (
                  <WasteMap 
                    onEarnPoints={handleEarnPoints} 
                  />
                )}

                {activeTab === 'forum' && (
                  <CommunityForum 
                    onEarnPoints={handleEarnPoints} 
                    onUnlockBadge={handleUnlockBadge}
                  />
                )}

                {activeTab === 'articles' && (
                  <DailyArticles 
                    onEarnPoints={handleEarnPoints} 
                    onUnlockBadge={handleUnlockBadge}
                  />
                )}

                {activeTab === 'planner' && (
                  <RecyclingPlanner 
                    onEarnPoints={handleEarnPoints} 
                    onTriggerNotification={addNotification}
                  />
                )}

                {activeTab === 'leaderboard' && (
                  <LeaderboardAndBadges 
                    profile={profile} 
                    badges={badges}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modern minimalist footer credits matching Natural Tones HTML style */}
      <footer className="bg-[#1a2e1d] py-6 text-center text-[10px] text-white/50 uppercase tracking-[0.2em] font-sans flex flex-col md:flex-row justify-between px-8 gap-4 border-t border-[#4a6d4d]/20">
        <span>Designed for Sustainability • EcoQuest v1.0</span>
        <div className="flex justify-center gap-6 text-white/70">
          <span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span>
          <span className="hover:text-white transition-colors cursor-pointer">Panduan Komunitas</span>
          <span className="hover:text-white transition-colors cursor-pointer">Kontak Bantuan</span>
        </div>
      </footer>
    </div>
  );
}
