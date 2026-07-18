import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, Scale, Leaf, Award, Check, Plus, HelpCircle } from 'lucide-react';
import { WasteLog } from '../types';

interface ProgressTrackerProps {
  onEarnPoints: (points: number, source: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onLogWaste: (organicGrams: number, inorganicGrams: number) => void;
}

const INITIAL_LOGS: WasteLog[] = [
  { id: 'l-1', date: 'Senin', organic: 350, inorganic: 120 },
  { id: 'l-2', date: 'Selasa', organic: 400, inorganic: 180 },
  { id: 'l-3', date: 'Rabu', organic: 200, inorganic: 90 },
  { id: 'l-4', date: 'Kamis', organic: 500, inorganic: 220 },
  { id: 'l-5', date: 'Jumat', organic: 300, inorganic: 150 },
  { id: 'l-6', date: 'Sabtu', organic: 0, inorganic: 0 },
  { id: 'l-7', date: 'Minggu', organic: 0, inorganic: 0 }
];

export default function ProgressTracker({ onEarnPoints, onUnlockBadge, onLogWaste }: ProgressTrackerProps) {
  const [logs, setLogs] = useState<WasteLog[]>(INITIAL_LOGS);
  const [organicInput, setOrganicInput] = useState('');
  const [inorganicInput, setInorganicInput] = useState('');
  const [targetWeekly, setTargetWeekly] = useState(2500); // 2.5 kg target
  const [logSuccess, setLogSuccess] = useState(false);

  // Simple active challenge list
  const [challenges, setChallenges] = useState([
    { id: 'c1', title: 'Hindari Sedotan Plastik', desc: 'Gunakan stainless straw selama seminggu penuh', completed: true, points: 20 },
    { id: 'c2', title: 'Kompos Sayuran Pertama', desc: 'Ubah sisa dapur menjadi kompos berharga', completed: false, points: 50 },
    { id: 'c3', title: 'Belanja Tas Kain', desc: 'Gunakan totebag belanjamu sendiri di pasar', completed: false, points: 30 },
  ]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const org = parseFloat(organicInput) || 0;
    const inorg = parseFloat(inorganicInput) || 0;

    if (org <= 0 && inorg <= 0) return;

    // Add to today's log (for demo, we add/modify Saturday)
    setLogs(prev => prev.map(log => {
      if (log.date === 'Sabtu') {
        return {
          ...log,
          organic: log.organic + org,
          inorganic: log.inorganic + inorg
        };
      }
      return log;
    }));

    onLogWaste(org, inorg);
    onEarnPoints(20, 'Pencatatan Reduksi Sampah Harian');
    onUnlockBadge('b2'); // Unlock 'Duta Zero-Waste' on log

    setOrganicInput('');
    setInorganicInput('');
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const handleCompleteChallenge = (id: string, points: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        if (!c.completed) {
          onEarnPoints(points, `Menyelesaikan Tantangan: ${c.title}`);
        }
        return { ...c, completed: true };
      }
      return c;
    }));
  };

  // Calculations
  const totalOrganic = logs.reduce((acc, curr) => acc + curr.organic, 0);
  const totalInorganic = logs.reduce((acc, curr) => acc + curr.inorganic, 0);
  const grandTotal = totalOrganic + totalInorganic;
  const carbonSaved = (totalInorganic * 2.5 + totalOrganic * 0.8) / 1000; // Formula: 1kg anorganic saves ~2.5kg CO2, 1kg organic saves ~0.8kg CO2
  const progressPercent = Math.min(Math.round((grandTotal / targetWeekly) * 100), 100);

  // Render a beautifully custom bar chart via responsive SVG
  const maxVal = Math.max(...logs.map(l => l.organic + l.inorganic), 500);

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="progress-tracker-container">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
          📊 Pelacak Pengurangan Sampah Pribadi
        </h2>
        <p className="text-[#8a9a8c] text-sm mt-1">
          Catat berat sampah dapur dan plastik sekali pakai yang berhasil Anda kelola untuk melihat sumbangsih karbon Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Logs Form & stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main stats counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f9fbf8] border border-[#edf1eb] rounded-[24px] p-4 flex flex-col shadow-xs">
              <span className="text-[10px] font-bold text-[#8a9a8c] uppercase tracking-wider">Total Sampah Tereduksi</span>
              <span className="text-2xl font-extrabold text-[#4a6d4d] mt-1 font-mono">{(grandTotal / 1000).toFixed(2)} Kg</span>
              <span className="text-[10px] text-[#2d3a2e] mt-2 flex items-center gap-1 font-medium">
                <Leaf className="w-3.5 h-3.5 text-[#4a6d4d]" /> {totalOrganic}g Org | {totalInorganic}g Anorg
              </span>
            </div>

            <div className="bg-[#f9fbf8] border border-[#edf1eb] rounded-[24px] p-4 flex flex-col shadow-xs">
              <span className="text-[10px] font-bold text-[#8a9a8c] uppercase tracking-wider">Reduksi Karbon CO2</span>
              <span className="text-2xl font-extrabold text-[#b47c5d] mt-1 font-mono">{carbonSaved.toFixed(2)} Kg</span>
              <span className="text-[10px] text-[#2d3a2e] mt-2 font-medium">Setara menanam {(carbonSaved * 0.1).toFixed(1)} bibit pohon</span>
            </div>
          </div>

          {/* Form to log trash */}
          <div className="bg-[#f0f4ef]/50 border border-[#e5e9e2] p-5 rounded-[24px] shadow-2xs">
            <h3 className="font-bold text-[#1a2e1d] text-sm tracking-tight flex items-center gap-1.5 mb-1 font-display">
              <Scale className="w-4 h-4 text-[#4a6d4d]" /> Catat Sampah Tereduksi
            </h3>
            <p className="text-[#8a9a8c] text-xs mb-4 font-medium">Ubah sampah menjadi aksi hijau nyata.</p>

            {logSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-[#f0f4ef] border border-[#ccd5cb] text-[#4a6d4d] text-xs p-3 rounded-xl mb-4 font-bold text-center"
              >
                Pencatatan berhasil disimpan! +20 Poin EcoQuest
              </motion.div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#2d3a2e] uppercase tracking-wide">Organik (gram)</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      min="0"
                      value={organicInput}
                      onChange={(e) => setOrganicInput(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-white border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8a9a8c] font-bold">g</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#2d3a2e] uppercase tracking-wide">Anorganik (gram)</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      min="0"
                      value={inorganicInput}
                      onChange={(e) => setInorganicInput(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-white border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8a9a8c] font-bold">g</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md text-center"
                id="submit-waste-log-btn"
              >
                Simpan Log & Dapatkan Poin
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Target progress meter and weekly chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Progress Bar */}
          <div className="bg-[#f9fbf8] border border-[#e5e9e2] rounded-[24px] p-5 shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#8a9a8c] uppercase tracking-wide">Target Pengurangan Pekan Ini</span>
                <h4 className="text-base font-extrabold text-[#1a2e1d] font-display tracking-tight mt-1">
                  {(grandTotal / 1000).toFixed(1)}kg / {(targetWeekly / 1000).toFixed(1)}kg Terpenuhi
                </h4>
              </div>
              <span className="text-[#4a6d4d] text-xs font-mono font-bold bg-[#f0f4ef] px-3 py-1 rounded-full">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar background */}
            <div className="w-full bg-[#f0f4ef] rounded-full h-3 mt-4 overflow-hidden">
              <motion.div 
                className="bg-[#4a6d4d] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            
            <p className="text-[#8a9a8c] text-[11px] mt-2.5 leading-relaxed font-medium">
              *Rekomendasi target nasional: Mengurangi minimal 2 kg sampah per rumah tangga per pekan untuk menekan beban TPA lokal.
            </p>
          </div>

          {/* Interactive Custom SVG Bar Chart */}
          <div className="bg-[#f9fbf8] border border-[#e5e9e2] rounded-[24px] p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-[#1a2e1d] font-display uppercase tracking-wider mb-4 flex items-center gap-1">
              📈 Grafik Pekanan Reduksi Sampah
            </h4>

            {/* Responsive SVG Chart */}
            <div className="relative w-full h-[180px] flex items-end pt-4">
              <div className="absolute inset-x-0 bottom-6 border-b border-[#e5e9e2]/80" />
              <div className="absolute inset-x-0 bottom-[80px] border-b border-[#e5e9e2]/40" />
              <div className="absolute inset-x-0 bottom-[140px] border-b border-[#e5e9e2]/20" />

              <div className="w-full flex justify-between items-end h-[140px] px-2 z-10">
                {logs.map((log) => {
                  const combined = log.organic + log.inorganic;
                  const orgHeight = combined > 0 ? (log.organic / maxVal) * 120 : 0;
                  const inorgHeight = combined > 0 ? (log.inorganic / maxVal) * 120 : 0;
                  
                  return (
                    <div key={log.id} className="flex flex-col items-center flex-1 group">
                      {/* Interactive hover tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-[150px] bg-[#1a2e1d] text-white text-[9px] font-mono px-2 py-1 rounded-lg pointer-events-none transition-all flex flex-col items-center shadow-md">
                        <span>Org: {log.organic}g</span>
                        <span>Anorg: {log.inorganic}g</span>
                        <div className="w-1.5 h-1.5 bg-[#1a2e1d] rotate-45 -mb-1 mt-0.5" />
                      </div>

                      {/* Bar Stack */}
                      <div className="w-7 bg-[#f0f4ef] rounded-md overflow-hidden flex flex-col justify-end h-[120px] shadow-inner transition-all hover:ring-2 hover:ring-[#4a6d4d]/25">
                        {/* Inorganic Stack (clay orange color) */}
                        <motion.div 
                          className="bg-[#b47c5d]"
                          initial={{ height: 0 }}
                          animate={{ height: `${inorgHeight}px` }}
                        />
                        {/* Organic Stack (deep forest green color) */}
                        <motion.div 
                          className="bg-[#4a6d4d]"
                          initial={{ height: 0 }}
                          animate={{ height: `${orgHeight}px` }}
                        />
                      </div>

                      <span className="text-[10px] text-[#8a9a8c] font-bold mt-2.5">{log.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 justify-center items-center mt-3 text-[10px] text-[#8a9a8c] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#4a6d4d] rounded" /> Organik
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#b47c5d] rounded" /> Anorganik
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges & Daily Goals section */}
      <div className="mt-8 border-t border-[#e5e9e2] pt-6">
        <h3 className="font-bold text-[#1a2e1d] text-sm tracking-tight mb-4 flex items-center gap-1.5 font-display">
          <Award className="w-4 h-4 text-[#4a6d4d]" /> Misi Pelestarian Mandiri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((c) => (
            <div 
              key={c.id} 
              className={`p-4 rounded-[24px] border transition-all flex flex-col justify-between ${
                c.completed 
                  ? 'bg-[#f0f4ef]/40 border-[#e5e9e2] opacity-80' 
                  : 'bg-white border-[#e5e9e2] hover:border-[#ccd5cb]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-[#1a2e1d] text-xs tracking-tight">{c.title}</h4>
                  <span className="text-[9px] bg-[#f0f4ef] text-[#4a6d4d] px-1.5 py-0.5 rounded font-bold font-mono">+{c.points}p</span>
                </div>
                <p className="text-[#8a9a8c] text-[10px] mt-1.5 leading-relaxed font-medium">{c.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e5e9e2] flex items-center justify-between">
                {c.completed ? (
                  <span className="text-[#4a6d4d] font-bold text-[10px] flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3px]" /> Selesai
                  </span>
                ) : (
                  <button
                    onClick={() => handleCompleteChallenge(c.id, c.points)}
                    className="px-3 py-1.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
