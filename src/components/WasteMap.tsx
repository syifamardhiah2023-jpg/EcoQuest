import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_WASTE_LOCATIONS } from '../data/mockData';
import { WasteLocation } from '../types';
import { MapPin, Search, Phone, Clock, Star, Navigation, Plus, Check, Map as MapIcon, Layers } from 'lucide-react';

interface WasteMapProps {
  onEarnPoints: (points: number, source: string) => void;
}

export default function WasteMap({ onEarnPoints }: WasteMapProps) {
  const [locations, setLocations] = useState<WasteLocation[]>(INITIAL_WASTE_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<WasteLocation | null>(INITIAL_WASTE_LOCATIONS[0]);
  const [filterType, setFilterType] = useState<string>('All');
  
  // Custom location form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<'Bank Sampah' | 'TPS Terpadu' | 'Pusat Daur Ulang' | 'Depo Elektronik'>('Bank Sampah');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocMaterials, setNewLocMaterials] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter types helper
  const typesList = ['All', 'Bank Sampah', 'Pusat Daur Ulang', 'Depo Elektronik', 'TPS Terpadu'];

  // Filtered location selector
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.acceptedMaterials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || loc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocAddress) return;

    const materialsArray = newLocMaterials ? newLocMaterials.split(',').map(m => m.trim()) : ['Sampah Rumah Tangga'];
    const newLoc: WasteLocation = {
      id: `l-${Date.now()}`,
      name: newLocName,
      type: newLocType,
      address: newLocAddress,
      acceptedMaterials: materialsArray,
      coordinates: { 
        x: Math.floor(Math.random() * 60) + 20, 
        y: Math.floor(Math.random() * 60) + 20 
      },
      rating: 4.5,
      phone: '0812-xxxx-xxxx',
      openHours: '08:00 - 16:00 (Senin - Sabtu)'
    };

    setLocations((prev) => [...prev, newLoc]);
    setSelectedLocation(newLoc);
    setFormSubmitted(true);
    onEarnPoints(40, 'Usul Tempat Pembuangan Baru');

    setTimeout(() => {
      setShowAddForm(false);
      setFormSubmitted(false);
      // Reset form fields
      setNewLocName('');
      setNewLocAddress('');
      setNewLocMaterials('');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="waste-map-container">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
            📍 Peta Lokasi Daur Ulang EcoQuest
          </h2>
          <p className="text-[#8a9a8c] text-sm mt-1">
            Temukan lokasi Bank Sampah, depo e-waste, dan pusat daur ulang terdekat secara real-time.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#f0f4ef] hover:bg-[#dee9e1] text-[#4a6d4d] text-xs font-bold rounded-xl transition-all cursor-pointer self-start"
          id="add-location-btn"
        >
          <Plus className="w-4 h-4" /> Usulkan Lokasi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[450px]">
        {/* Left Side: Search, Filters & Location List */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 order-2 lg:order-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8a9a8c]" />
            <input
              type="text"
              placeholder="Cari lokasi atau bahan sampah (Plastik, Baterai, Kertas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f9fbf8] hover:bg-[#f0f4ef]/50 focus:bg-white text-xs text-[#2d3a2e] border border-[#ccd5cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20 focus:border-[#4a6d4d] transition-all placeholder:text-[#8a9a8c]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {typesList.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === type 
                    ? 'bg-[#4a6d4d] text-white shadow-sm' 
                    : 'bg-[#f0f4ef] hover:bg-[#dee9e1] text-[#2d3a2e]'
                }`}
              >
                {type === 'All' ? 'Semua' : type}
              </button>
            ))}
          </div>

          {/* Location Cards List */}
          <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-3 scrollbar-thin">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedLocation?.id === loc.id
                      ? 'bg-[#f0f4ef]/40 border-[#4a6d4d]/30 ring-1 ring-[#4a6d4d]/20'
                      : 'bg-white border-[#edf1eb] hover:border-[#ccd5cb] hover:bg-[#f9fbf8]/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      loc.type === 'Bank Sampah' ? 'bg-green-100 text-[#4a6d4d]' :
                      loc.type === 'Pusat Daur Ulang' ? 'bg-sky-100 text-[#2b6cb0]' :
                      loc.type === 'Depo Elektronik' ? 'bg-[#fcf8e3] text-[#b47c5d]' :
                      'bg-stone-100 text-stone-800'
                    }`}>
                      {loc.type}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-[#b47c5d]">
                      <Star className="w-3.5 h-3.5 fill-[#b47c5d] text-[#b47c5d]" /> {loc.rating.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1a2e1d] font-display text-sm mt-1.5 tracking-tight">{loc.name}</h4>
                  <p className="text-xs text-[#8a9a8c] mt-1 line-clamp-1">{loc.address}</p>
                  
                  {/* Accepted materials */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {loc.acceptedMaterials.map((mat, i) => (
                      <span key={i} className="bg-[#f0f4ef] text-[#4a6d4d] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#8a9a8c] text-xs font-medium">
                Tidak ada lokasi daur ulang yang cocok.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Styled Interactive Vector Map */}
        <div className="lg:col-span-7 flex flex-col gap-4 order-1 lg:order-2">
          {/* Vector Map Render */}
          <div className="relative bg-[#f0f4ef]/25 border border-[#e5e9e2] rounded-[24px] h-[300px] lg:h-full overflow-hidden flex items-center justify-center">
            {/* Styled Ambient Map Grid / Vector Elements */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#4a6d4d" strokeWidth="0.5" strokeOpacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Simulated River/Riverways */}
              <path d="M 0 80 Q 150 140 320 100 T 600 220" fill="none" stroke="#bae6fd" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
              <path d="M 0 80 Q 150 140 320 100 T 600 220" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
              
              {/* Simulated Main Roads */}
              <path d="M 50 0 L 120 400" fill="none" stroke="#f5f5f4" strokeWidth="14" opacity="0.9" />
              <path d="M 50 0 L 120 400" fill="none" stroke="#e7e5e4" strokeWidth="10" opacity="0.9" />
              <path d="M 0 180 H 600" fill="none" stroke="#f5f5f4" strokeWidth="14" opacity="0.9" />
              <path d="M 0 180 H 600" fill="none" stroke="#e7e5e4" strokeWidth="10" opacity="0.9" />
              <path d="M 280 0 V 400" fill="none" stroke="#f5f5f4" strokeWidth="10" opacity="0.9" />

              {/* Dynamic routing line to selected pin */}
              {selectedLocation && (
                <motion.path
                  d={`M 150 150 Q 200 120 ${selectedLocation.coordinates.x * 4} ${selectedLocation.coordinates.y * 3}`}
                  fill="none"
                  stroke="#4a6d4d"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 4 }}
                />
              )}
            </svg>

            {/* Static Simulated User Position marker */}
            <div 
              className="absolute bg-[#4a6d4d] border-2 border-white w-4 h-4 rounded-full shadow-md flex items-center justify-center cursor-help z-10"
              style={{ left: '150px', top: '150px' }}
              title="Posisi Anda"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
            </div>

            {/* Map Nodes (Locations Pins) */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  style={{ 
                    left: `${loc.coordinates.x}%`, 
                    top: `${loc.coordinates.y}%` 
                  }}
                >
                  <MapPin className={`w-8 h-8 drop-shadow-md transition-colors ${
                    isSelected ? 'text-[#4a6d4d] animate-bounce' : 'text-[#8a9a8c]'
                  }`} />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white text-[9px] font-bold text-stone-700 px-1.5 py-0.5 rounded shadow border border-stone-100 whitespace-nowrap">
                    {loc.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}

            {/* HUD Control Labels */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-[#e5e9e2] rounded-xl p-2.5 flex items-center gap-1.5 shadow-xs text-[10px] text-[#2d3a2e] font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#4a6d4d]" />
              <span>Real-Time Eco-Vector HUD Map v2.5</span>
            </div>
          </div>

          {/* Details Overlay Card of Selected Location */}
          <AnimatePresence mode="wait">
            {selectedLocation && (
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-[#f9fbf8] border border-[#e5e9e2] p-5 rounded-[24px]"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] bg-[#f0f4ef] text-[#4a6d4d] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {selectedLocation.type}
                    </span>
                    <h3 className="font-bold text-[#1a2e1d] font-display text-base mt-2 leading-tight tracking-tight">
                      {selectedLocation.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Meluncurkan simulasi navigasi EcoQuest ke: ${selectedLocation.name}.\nRute tercepat ditemukan: 1.4 km - Estimasi waktu 8 menit.`);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-[#4a6d4d]/10"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-white" /> Navigasi
                  </button>
                </div>

                <p className="text-xs text-[#2d3a2e] mt-2 font-medium">{selectedLocation.address}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 border-t border-[#e5e9e2] pt-3 text-xs text-[#8a9a8c] font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#4a6d4d]" />
                    <span>{selectedLocation.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#4a6d4d]" />
                    <span>Hubungi: {selectedLocation.phone}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold text-[#8a9a8c] block tracking-wide">Bahan Sampah yang Diterima:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedLocation.acceptedMaterials.map((mat, i) => (
                      <span key={i} className="bg-white border border-[#e5e9e2] text-[#2d3a2e] text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm">
                        🌿 {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Usulkan Lokasi Baru Popup Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-6 max-w-md w-full border border-[#e5e9e2] shadow-xl"
          >
            <h3 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
              📝 Usulkan Lokasi Daur Ulang Baru
            </h3>
            <p className="text-[#8a9a8c] text-xs mt-1 font-medium">
              Bantu warga menemukan tempat pembuangan ramah lingkungan di sekitarmu dan raih 40 Poin!
            </p>

            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#f0f4ef] text-[#4a6d4d] rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <h4 className="font-bold text-[#1a2e1d] text-base font-display">Terima Kasih!</h4>
                <p className="text-[#8a9a8c] text-xs mt-1 font-medium">Lokasi berhasil ditambahkan di peta dan Anda mendapatkan 40 Poin.</p>
              </div>
            ) : (
              <form onSubmit={handleAddLocation} className="space-y-4 mt-4">
                <div>
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Nama Tempat / Bank Sampah</label>
                  <input
                    type="text"
                    required
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    placeholder="Contoh: Bank Sampah Asri Jaya"
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                  />
                </div>

                <div>
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Jenis Fasilitas</label>
                  <select
                    value={newLocType}
                    onChange={(e: any) => setNewLocType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                  >
                    <option value="Bank Sampah">Bank Sampah</option>
                    <option value="Pusat Daur Ulang">Pusat Daur Ulang</option>
                    <option value="Depo Elektronik">Depo Pengumpulan Elektronik (E-Waste)</option>
                    <option value="TPS Terpadu">TPS Terpadu</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Alamat Lengkap</label>
                  <input
                    type="text"
                    required
                    value={newLocAddress}
                    onChange={(e) => setNewLocAddress(e.target.value)}
                    placeholder="Nama jalan, kecamatan, kode pos..."
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                  />
                </div>

                <div>
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Bahan Diterima (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={newLocMaterials}
                    onChange={(e) => setNewLocMaterials(e.target.value)}
                    placeholder="Contoh: Plastik, Kertas, Minyak Jelantah"
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
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
                    Kirim Lokasi
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
