import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_RECYCLING_SCHEDULES } from '../data/mockData';
import { RecyclingSchedule } from '../types';
import { Calendar, Bell, BellOff, Plus, Check, Trash2, Clock, Sparkles } from 'lucide-react';

interface RecyclingPlannerProps {
  onEarnPoints: (points: number, source: string) => void;
  onTriggerNotification: (message: string) => void;
}

export default function RecyclingPlanner({ onEarnPoints, onTriggerNotification }: RecyclingPlannerProps) {
  const [schedules, setSchedules] = useState<RecyclingSchedule[]>(INITIAL_RECYCLING_SCHEDULES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDay, setNewDay] = useState('Senin');
  const [newCategory, setNewCategory] = useState<'organik' | 'anorganik' | 'kertas' | 'plastik' | 'b3'>('organik');
  const [newTime, setNewTime] = useState('08:00');

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const toggleReminder = (id: string) => {
    setSchedules(prev => prev.map(sched => {
      if (sched.id === id) {
        const nextState = !sched.reminderEnabled;
        if (nextState) {
          onTriggerNotification(`Pengingat aktif untuk jadwal pengumpulan ${sched.category.toUpperCase()} pada hari ${sched.day}.`);
        }
        return {
          ...sched,
          reminderEnabled: nextState
        };
      }
      return sched;
    }));
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSched: RecyclingSchedule = {
      id: `s-${Date.now()}`,
      day: newDay,
      category: newCategory,
      time: newTime,
      reminderEnabled: true
    };

    setSchedules(prev => [...prev, newSched].sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day)));
    setShowAddForm(false);
    onEarnPoints(10, `Menjadwalkan Daur Ulang Baru (${newCategory.toUpperCase()})`);
    onTriggerNotification(`Jadwal pengumpulan ${newCategory.toUpperCase()} berhasil dibuat untuk hari ${newDay} jam ${newTime}.`);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const simulateNotification = (sched: RecyclingSchedule) => {
    const messages = {
      organik: `🟢 PENGINGAT DAUR ULANG ECOQUEST: Hari ini adalah jadwal pembuangan sampah ORGANIK (${sched.time} WIB). Siapkan sisa sayur/buah Anda untuk dikompos atau diletakkan di biopori!`,
      anorganik: `🔵 PENGINGAT DAUR ULANG ECOQUEST: Saatnya memilah sampah ANORGANIK (${sched.time} WIB). Kumpulkan botol plastik, logam, atau gelas bekas dan bersihkan agar siap didaur ulang.`,
      kertas: `📦 PENGINGAT DAUR ULANG ECOQUEST: Jadwal pengangkutan KERTAS & KARDUS (${sched.time} WIB). Pastikan kardus dilipat rata dan kering untuk menjaga nilai ekonomis daur ulangnya!`,
      plastik: `🥤 PENGINGAT DAUR ULANG ECOQUEST: Pengumpulan PLASTIK SECARA MANDIRI (${sched.time} WIB). Kumpulkan botol PET bersih lalu segera bawa ke Bank Sampah terdekat untuk ditukar poin!`,
      b3: `🔴 PERINGATAN ECOQUEST: Jadwal Pembuangan Limbah Elektronik & B3 (${sched.time} WIB). Kumpulkan baterai rusak, kabel, atau lampu bekas. Jangan campur ke tempat sampah umum!`
    };

    onTriggerNotification(messages[sched.category]);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="recycling-planner-container">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
            📅 Jadwal Pengingat Daur Ulang
          </h2>
          <p className="text-[#8a9a8c] text-sm mt-1">
            Atur dan aktifkan pengingat agar Anda tidak melewatkan hari pengumpulan atau penyetoran sampah terpilah.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer self-start"
          id="add-schedule-btn"
        >
          <Plus className="w-4 h-4" /> Tambah Jadwal Baru
        </button>
      </div>

      {/* Grid displays active schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="space-y-4">
          <h3 className="font-bold text-[#1a2e1d] font-display text-sm tracking-tight flex items-center gap-1.5">
            🔔 Alarm Pengingat Aktif ({schedules.length})
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
            {schedules.map((sched) => (
              <div
                key={sched.id}
                className="bg-[#f9fbf8]/50 border border-[#e5e9e2] rounded-[24px] p-4 flex items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {/* Category color bullet */}
                  <div className={`w-3.5 h-3.5 rounded-full ${
                    sched.category === 'organik' ? 'bg-[#4a6d4d]' :
                    sched.category === 'plastik' ? 'bg-[#b47c5d]' :
                    sched.category === 'kertas' ? 'bg-amber-600' :
                    sched.category === 'b3' ? 'bg-[#a65d50]' :
                    'bg-[#8a9a8c]'
                  }`} />
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a2e1d] text-sm capitalize">{sched.day} - {sched.category}</span>
                      <span className="text-[10px] bg-white border border-[#e5e9e2] text-[#2d3a2e] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                        <Clock className="w-3 h-3 text-[#4a6d4d]" /> {sched.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8a9a8c] mt-1 leading-relaxed font-semibold">
                      {sched.category === 'organik' ? 'Sisa makanan, kulit buah, daun' :
                       sched.category === 'plastik' ? 'Botol bekas, gelas plastik, kresek' :
                       sched.category === 'kertas' ? 'Koran, kardus paket, buku bekas' :
                       sched.category === 'b3' ? 'Baterai, lampu neon, barang elektronik' :
                       'Sampah anorganik lainnya'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Trigger test simulated alert button */}
                  <button
                    onClick={() => simulateNotification(sched)}
                    className="p-1.5 hover:bg-[#f0f4ef]/80 text-[#4a6d4d] rounded-lg cursor-pointer transition-colors text-xs font-bold"
                    title="Simulasikan Notifikasi"
                  >
                    Uji Notifikasi
                  </button>

                  <button
                    onClick={() => toggleReminder(sched.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      sched.reminderEnabled
                        ? 'bg-[#f0f4ef] border-[#e5e9e2] text-[#4a6d4d]'
                        : 'bg-[#f0f4ef]/20 border-[#edf1eb] text-[#8a9a8c]'
                    }`}
                  >
                    {sched.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDeleteSchedule(sched.id)}
                    className="p-2 text-[#8a9a8c] hover:text-[#b47c5d] hover:bg-[#fcf5f2] rounded-xl cursor-pointer transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informative tips box on schedules */}
        <div className="bg-[#f0f4ef]/40 border border-[#e5e9e2] rounded-[32px] p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-10 h-10 bg-[#f0f4ef] rounded-2xl flex items-center justify-center text-[#4a6d4d] mb-3">
              <Sparkles className="w-5 h-5 fill-[#f0f4ef]" />
            </div>
            <h4 className="font-bold text-[#1a2e1d] font-display text-sm tracking-tight mb-2">Mengapa Jadwal Sampah Terpisah Penting?</h4>
            <p className="text-[#2d3a2e] text-xs leading-relaxed space-y-2 font-medium">
              <span>Membuang sampah secara acak tercampur dalam satu wadah menurunkan tingkat daur ulang nasional hingga di bawah 10%.</span>
              <br /><br />
              <span>Dengan memanfaatkan sistem penjadwalan terpilah EcoQuest, Anda berkontribusi menjaga kemurnian bahan baku sampah agar siap dilebur kembali tanpa mencemari tanah.</span>
            </p>
          </div>

          <div className="border-t border-[#e5e9e2] pt-4 mt-6 flex justify-between items-center text-[10px] text-[#4a6d4d] font-bold">
            <span>✨ Jadwal yang Anda buat disinkronkan dengan kalender lokal</span>
            <span className="bg-[#4a6d4d] text-white px-2 py-0.5 rounded font-mono font-bold">Synced</span>
          </div>
        </div>
      </div>

      {/* Add Schedule Form Popover Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-[#e5e9e2] shadow-xl"
          >
            <h3 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
              📝 Buat Jadwal Baru
            </h3>
            <p className="text-[#8a9a8c] text-xs mt-1 font-medium">
              Tambahkan pengingat kalender daur ulang khusus Anda untuk memperoleh 10 Poin.
            </p>

            <form onSubmit={handleAddSchedule} className="space-y-4 mt-4">
              <div>
                <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Hari Pengumpulan</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20 font-medium"
                >
                  {daysOfWeek.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Kategori Sampah</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20 font-medium"
                >
                  <option value="organik">Organik</option>
                  <option value="plastik">Plastik / Botol</option>
                  <option value="kertas">Kertas / Kardus</option>
                  <option value="anorganik">Anorganik Lainnya</option>
                  <option value="b3">Limbah Elektronik & B3</option>
                </select>
              </div>

              <div>
                <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Jam Pengingat</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20 font-bold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 border border-[#ccd5cb] hover:bg-[#f0f4ef] text-[#2d3a2e] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center shadow-sm"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
