import { motion } from 'motion/react';
import { Badge, UserProfile } from '../types';
import { INITIAL_BADGES, LEADERBOARD_PLAYERS } from '../data/mockData';
import { Award, Trophy, Star, Sparkles, Shield, Compass, User } from 'lucide-react';

interface LeaderboardAndBadgesProps {
  profile: UserProfile;
  badges: Badge[];
}

export default function LeaderboardAndBadges({ profile, badges }: LeaderboardAndBadgesProps) {
  // Compute level XP progress
  const pointsForNextLevel = 100;
  const currentXP = profile.points % pointsForNextLevel;
  const xpPercent = Math.min((currentXP / pointsForNextLevel) * 100, 100);

  // Combine static leaderboard with the dynamic active user
  const rawLeaderboard = [
    ...LEADERBOARD_PLAYERS.map(p => ({ ...p, isCurrentUser: false })),
    {
      rank: 99, // Place-holder rank, sorted later
      name: `${profile.username} (Anda)`,
      points: profile.points,
      level: profile.level,
      badge: badges.find(b => profile.badges.includes(b.id))?.name || '🌱 Eco-Newbie',
      isCurrentUser: true
    }
  ];

  // Sort and assign correct ranks based on points
  const sortedLeaderboard = rawLeaderboard
    .sort((a, b) => b.points - a.points)
    .map((player, idx) => ({
      ...player,
      rank: idx + 1
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="leaderboard-badges-container">
      {/* Left panel: Badge Rack & Level Progression */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2]">
          <h2 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2 mb-6">
            🎖️ Lencana & Kemajuan Profil EcoQuest
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-[#f9fbf8] border border-[#ccd5cb] p-5 rounded-[24px] mb-8 shadow-2xs">
            {/* XP circular visual HUD */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center relative">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e9e2"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#4a6d4d"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * xpPercent) / 100}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[#8a9a8c] text-[10px] font-bold uppercase tracking-wider">Level</span>
                  <span className="text-3xl font-black text-[#4a6d4d] leading-none">{profile.level}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#2d3a2e] font-mono mt-2 font-semibold">{currentXP} / 100 XP</span>
            </div>

            <div className="sm:col-span-8 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#1a2e1d] font-display text-base">{profile.username}</h3>
                <span className="bg-[#f0f4ef] text-[#4a6d4d] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-[#e5e9e2]">
                  <Star className="w-3.5 h-3.5 fill-[#4a6d4d] stroke-none" /> {profile.points} Poin
                </span>
              </div>
              <p className="text-[#2d3a2e] text-xs leading-relaxed font-medium">
                Anda aktif melindungi ekosistem selama <span className="font-bold text-[#4a6d4d]">{profile.streak} hari berturut-turut</span>. Selesaikan misi harian untuk melipatgandakan koin XP!
              </p>
            </div>
          </div>

          {/* Badges Grid List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#8a9a8c] uppercase tracking-wider">Rak Lencana Lingkungan ({profile.badges.length} / {badges.length})</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const isUnlocked = profile.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-[24px] border text-center transition-all flex flex-col items-center justify-between shadow-2xs ${
                      isUnlocked
                        ? 'bg-[#f9fbf8] border-[#ccd5cb]'
                        : 'bg-stone-100/40 border-[#e5e9e2] opacity-40'
                    }`}
                  >
                    {/* Badge Icon bubble */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm mb-3 bg-gradient-to-r ${badge.color}`}>
                      {badge.icon}
                    </div>

                    <div>
                      <h5 className="font-bold text-[#1a2e1d] text-xs tracking-tight">{badge.name}</h5>
                      <p className="text-[#2d3a2e] text-[9px] leading-snug mt-1 font-medium">{badge.description}</p>
                    </div>

                    {isUnlocked ? (
                      <span className="mt-3 text-[9px] bg-[#f0f4ef] text-[#4a6d4d] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#ccd5cb]">
                        Terbuka
                      </span>
                    ) : (
                      <span className="mt-3 text-[9px] bg-[#fcf5f2] text-[#b47c5d] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Terkunci
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Community Leaderboard list */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2 mb-6">
              🏆 Papan Peringkat EcoQuest
            </h2>

            <div className="space-y-2">
              {sortedLeaderboard.map((player) => {
                const isTop3 = player.rank <= 3;
                return (
                  <div
                    key={player.rank}
                    className={`p-3.5 rounded-[20px] border flex items-center justify-between gap-3 transition-all ${
                      player.isCurrentUser
                        ? 'bg-[#f0f4ef] border-[#ccd5cb] ring-1 ring-[#4a6d4d]/10 font-bold'
                        : 'bg-[#f9fbf8]/50 border-[#e5e9e2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank medals */}
                      <span className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-black ${
                        player.rank === 1 ? 'bg-amber-100 text-amber-700' :
                        player.rank === 2 ? 'bg-stone-100 text-stone-700' :
                        player.rank === 3 ? 'bg-orange-50 text-orange-800' :
                        'text-stone-400 font-mono'
                      }`}>
                        {player.rank === 1 ? '🥇' :
                         player.rank === 2 ? '🥈' :
                         player.rank === 3 ? '🥉' :
                         player.rank}
                      </span>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#1a2e1d]">{player.name}</span>
                          {player.isCurrentUser && (
                            <span className="text-[9px] bg-[#4a6d4d] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#2d3a2e] block leading-tight font-medium">
                          {player.badge} (Lv {player.level})
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-[#4a6d4d] block">
                        {player.points}p
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#f0f4ef]/30 border border-[#e5e9e2] p-4 rounded-[20px] mt-6 text-[10px] text-[#2d3a2e] flex items-start gap-2.5 leading-relaxed font-semibold">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Papan peringkat disegarkan setiap pekan. Tiga kontributor dengan nilai tertinggi mendapatkan bonus voucher e-wallet diskon produk zero-waste dari gerai sponsor!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
