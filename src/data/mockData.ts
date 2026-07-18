import { TrashItem, Badge, DailyMission, Article, WasteLocation, ForumPost, RecyclingSchedule } from '../types';

export const INITIAL_TRASH_ITEMS: TrashItem[] = [
  {
    id: 't1',
    name: 'Kulit Pisang',
    category: 'organik',
    points: 10,
    description: 'Bahan organik mudah membusuk yang kaya kalium.',
    recyclingMethod: 'Bisa dijadikan kompos atau pupuk organik cair untuk menyuburkan tanaman.',
    icon: '🍌'
  },
  {
    id: 't2',
    name: 'Botol Plastik Bekas',
    category: 'anorganik',
    points: 10,
    description: 'Polimer sintetis (PET) yang membutuhkan ratusan tahun untuk terurai.',
    recyclingMethod: 'Cuci bersih, lepaskan label, lalu kumpulkan ke Bank Sampah terdekat untuk didaur ulang.',
    icon: '🧴'
  },
  {
    id: 't3',
    name: 'Sisa Sayuran',
    category: 'organik',
    points: 10,
    description: 'Potongan sayur dapur yang mengandung nitrogen tinggi.',
    recyclingMethod: 'Sangat cocok dimasukkan ke dalam wadah komposter atau lubang biopori.',
    icon: '🥬'
  },
  {
    id: 't4',
    name: 'Kaleng Minuman aluminium',
    category: 'anorganik',
    points: 10,
    description: 'Logam ringan yang dapat didaur ulang tanpa batas waktu.',
    recyclingMethod: 'Pipihkan untuk menghemat ruang, kumpulkan ke pusat pengolahan logam atau bank sampah.',
    icon: '🥤'
  },
  {
    id: 't5',
    name: 'Daun Kering',
    category: 'organik',
    points: 10,
    description: 'Bahan karbon tinggi (cokelat) untuk keseimbangan kompos.',
    recyclingMethod: 'Gunakan sebagai mulsa tanaman atau campurkan dengan bahan hijau (nitrogen) di komposter.',
    icon: '🍂'
  },
  {
    id: 't6',
    name: 'Kardus Bekas Paket',
    category: 'anorganik',
    points: 10,
    description: 'Kertas tebal berserat yang bernilai ekonomi tinggi saat didaur ulang.',
    recyclingMethod: 'Lepaskan selotip plastik, lipat hingga rata, lalu serahkan ke pengepul atau bank sampah.',
    icon: '📦'
  },
  {
    id: 't7',
    name: 'Cangkang Telur',
    category: 'organik',
    points: 10,
    description: 'Kandungan kalsium karbonat tinggi yang bagus untuk tanah.',
    recyclingMethod: 'Hancurkan hingga halus lalu taburkan di sekitar tanaman sebagai pencegah hama siput dan pupuk alami.',
    icon: '🥚'
  },
  {
    id: 't8',
    name: 'Kantong Plastik Kresek',
    category: 'anorganik',
    points: 10,
    description: 'Plastik sekali pakai berdensitas rendah (LDPE).',
    recyclingMethod: 'Kurangi penggunaannya. Jika sudah terlanjur, gunakan berulang kali atau donasikan ke pembuat ecobrick.',
    icon: '🛍️'
  },
  {
    id: 't9',
    name: 'Apel Setengah Dimakan',
    category: 'organik',
    points: 10,
    description: 'Sisa buah manis yang cepat membusuk menarik mikroba pengurai.',
    recyclingMethod: 'Buat cairan Eco-Enzyme dari sisa kulit buah segar dicampur gula merah dan air.',
    icon: '🍎'
  },
  {
    id: 't10',
    name: 'Pecahan Kaca/Gelas',
    category: 'anorganik',
    points: 15,
    description: 'Kaca silika yang tajam dan tahan lama jika dibuang begitu saja.',
    recyclingMethod: 'Bungkus aman dalam wadah kardus tebal agar tidak melukai petugas, lalu bawa ke pengepul khusus kaca.',
    icon: '🥛'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Prajurit Organik',
    description: 'Selesaikan pemilahan sampah organik tanpa kesalahan di game.',
    requirement: 'Selesaikan minimal 1 game penyortiran dengan skor sempurna.',
    icon: '🌱',
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'b2',
    name: 'Duta Zero-Waste',
    description: 'Catat pengurangan sampah harian Anda selama 3 hari berturut-turut.',
    requirement: 'Log sampah 3 kali di pelacak kemajuan.',
    icon: '🌍',
    color: 'from-blue-400 to-teal-600'
  },
  {
    id: 'b3',
    name: 'Penyelamat Bumi',
    description: 'Kumpulkan 200 poin kontribusi lingkungan.',
    requirement: 'Capai total 200 poin di akun EcoQuest.',
    icon: '👑',
    color: 'from-amber-400 to-orange-600'
  },
  {
    id: 'b4',
    name: 'Penyortir Ulung',
    description: 'Mainkan Game Penyortir Sampah sebanyak 5 kali.',
    requirement: 'Selesaikan 5 sesi permainan sortir sampah.',
    icon: '🎮',
    color: 'from-purple-400 to-indigo-600'
  },
  {
    id: 'b5',
    name: 'Pembaca Setia',
    description: 'Baca 3 artikel edukasi harian dan selesaikan kuisnya.',
    requirement: 'Selesaikan kuis di minimal 3 artikel berbeda.',
    icon: '📚',
    color: 'from-pink-400 to-rose-600'
  }
];

export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Pilahkan Dengan Sempurna',
    description: 'Mainkan Game Penyortir Sampah dan raih minimal skor 80 poin.',
    rewardPoints: 30,
    status: 'available',
    type: 'game'
  },
  {
    id: 'm2',
    title: 'Catat Jurnal Sampah',
    description: 'Gunakan tracker harian untuk mencatat estimasi berat sampah Anda hari ini.',
    rewardPoints: 20,
    status: 'available',
    type: 'log'
  },
  {
    id: 'm3',
    title: 'Menyerap Ilmu Baru',
    description: 'Baca satu artikel edukasi lingkungan hari ini dan jawab kuisnya.',
    rewardPoints: 25,
    status: 'available',
    type: 'read'
  },
  {
    id: 'm4',
    title: 'Suara Komunitas',
    description: 'Tulis ide kreatif atau tips pengurangan sampah di Forum Komunitas Hijau.',
    rewardPoints: 15,
    status: 'available',
    type: 'forum'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Mengenal Konsep 5R untuk Hidup Minim Sampah',
    category: 'Gaya Hidup',
    readTime: '3 mnt baca',
    excerpt: 'Langkah melampaui sekadar Recycle dengan menerapkan Refuse, Reduce, Reuse, Purpurpose, dan Recycle.',
    content: `Konsep pengelolaan sampah modern kini berkembang melampaui 3R klasik (Reduce, Reuse, Recycle) menjadi 5R:
1. **Refuse (Menolak)**: Menolak penggunaan produk sekali pakai, seperti kantong plastik, sedotan, dan kemasan berlebih. Ini adalah benteng pertahanan pertama.
2. **Reduce (Mengurangi)**: Mengurangi kuantitas konsumsi barang belanjaan harian Anda. Belilah hanya yang benar-benar Anda butuhkan.
3. **Reuse (Menggunakan Kembali)**: Menggunakan kembali barang-barang yang masih berfungsi, seperti botol isi ulang, kotak bekal, dan totebag kain belanjaan.
4. **Repurpose (Alih Fungsi)**: Memberi fungsi baru pada barang bekas (upcycling) sebelum memutuskan untuk membuangnya, seperti membuat pot tanaman dari kaleng atau botol bekas.
5. **Recycle (Mendaur Ulang)**: Langkah terakhir ketika sampah tidak bisa dihindari atau digunakan ulang. Sampah diproses kembali menjadi bahan baku baru.

Dengan menerapkan 5R secara berurutan, kita dapat menekan laju timbulan sampah secara signifikan menuju kehidupan Zero Waste!`,
    quiz: {
      question: 'Langkah manakah dalam 5R yang dianggap sebagai pertahanan utama untuk mencegah penimbunan sampah sejak awal?',
      options: [
        'Recycle (Mendaur Ulang)',
        'Refuse (Menolak pembelian/pemakaian barang sekali pakai)',
        'Reuse (Menggunakan kembali botol bekas)',
        'Repurpose (Mengubah botol plastik jadi pot)'
      ],
      correctAnswerIndex: 1,
      explanation: 'Refuse (Menolak) adalah langkah pertama dan paling utama karena menolak barang potensial sampah masuk ke kehidupan kita sejak awal.'
    }
  },
  {
    id: 'a2',
    title: 'Dampak Tersembunyi Mikroplastik Bagi Ekosistem',
    category: 'Sains & Lingkungan',
    readTime: '4 mnt baca',
    excerpt: 'Plastik tidak pernah benar-benar lenyap, melainkan hancur menjadi partikel mikroskopis berbahaya yang mengancam biota laut dan kesehatan manusia.',
    content: `Mikroplastik adalah partikel plastik berukuran kurang dari 5 milimeter yang berasal dari degradasi sampah plastik besar akibat radiasi matahari atau sikat mekanis. 

Partikel berbahaya ini kini ditemukan hampir di semua tempat: dasar laut terdalam, salju pegunungan Everest, organ dalam biota laut, hingga aliran darah manusia. 

**Bagaimana Mikroplastik Masuk ke Tubuh Kita?**
- **Rantai Makanan Laut**: Ikan dan kerang secara tidak sengaja memakan mikroplastik karena disangka plankton. Manusia yang mengonsumsi seafood tersebut akhirnya ikut menelan mikroplastik.
- **Air Minum**: Baik air keran maupun air kemasan botol plastik sekali pakai terbukti mengandung mikropartikel plastik yang luruh dari kemasannya.

**Langkah Nyata Mengurangi Mikroplastik:**
1. Hindari pemanasan wadah plastik di dalam microwave.
2. Ganti spons cuci piring sintetis dengan bahan alami seperti serat loofah (gambas kering).
3. Gunakan pakaian berbahan serat alami (katun, linen, wol) karena serat sintetis melepas jutaan mikroplastik saat dicuci.`,
    quiz: {
      question: 'Apa definisi dari mikroplastik?',
      options: [
        'Plastik ramah lingkungan yang bisa dimakan ikan',
        'Partikel plastik berukuran kurang dari 5 milimeter akibat degradasi bahan plastik',
        'Zat kimia cair untuk melunakkan polimer plastik',
        'Plastik raksasa yang menutupi permukaan samudra'
      ],
      correctAnswerIndex: 1,
      explanation: 'Mikroplastik adalah fragmen plastik dengan ukuran kurang dari 5 milimeter yang terurai dari produk plastik besar.'
    }
  },
  {
    id: 'a3',
    title: 'Panduan Lengkap Membuat Kompos Skala Rumah Tangga',
    category: 'Panduan Praktis',
    readTime: '5 mnt baca',
    excerpt: 'Ubah sampah organik dapur Anda menjadi emas hitam penyubur tanah dengan metode komposting sederhana di rumah.',
    content: `Sekitar 50-60% sampah rumah tangga adalah sampah organik. Jika dibuang langsung ke TPA, sampah ini akan mengalami penguraian anaerob yang menghasilkan gas metana—gas rumah kaca yang 25 kali lebih kuat dari CO2 dalam memicu pemanasan global.

Membuat kompos sendiri adalah solusi terbaik! Berikut formula rahasia kompos sukses (Rasio C:N):

1. **Bahan Hijau (Kaya Nitrogen)**: Sisa sayuran dapar, kulit buah, potongan rumput segar, ampas kopi.
2. **Bahan Cokelat (Kaya Karbon)**: Daun kering, kertas/kardus polos tanpa selotip, serutan kayu, cangkang telur.

**Cara Memulai Kompos Wadah Sederhana:**
- Siapkan ember berlubang kecil di bagian bawah untuk sirkulasi udara dan jalan cairan lindi.
- Masukkan lapisan ranting/daun kering di dasar wadah sebagai drainase.
- Tambahkan lapisan sampah hijau dapur bergantian dengan daun cokelat. Rasio ideal adalah 1 bagian hijau : 2 bagian cokelat.
- Jaga kelembapan agar seperti spons basah yang diperas (tidak becek, tidak kering).
- Aduk sekali seminggu. Dalam waktu 4-6 minggu, kompos Anda siap panen dengan aroma harum seperti tanah hutan segar!`,
    quiz: {
      question: 'Gas berbahaya apa yang dihasilkan jika sampah organik membusuk di TPA tanpa oksigen?',
      options: [
        'Oksigen murni',
        'Uap air alami',
        'Gas metana (methane gas)',
        'Gas helium ringan'
      ],
      correctAnswerIndex: 2,
      explanation: 'Kondisi anaerob (tanpa oksigen) di tumpukan TPA memicu pelepasan gas metana yang berkontribusi tinggi pada pemanasan global.'
    }
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: 'Rian_Hijau99',
    authorBadge: 'Prajurit Organik',
    category: 'ZeroWaste',
    title: 'Tips Memulai Belanja Tanpa Plastik di Pasar Tradisional',
    content: 'Halo teman-teman! Kemarin saya mencoba belanja mingguan di pasar tanpa menggunakan plastik sekali pakai sama sekali. Kuncinya adalah membawa 5 kantong kain jaring kecil untuk sayur/buah, wadah food container plastik sendiri untuk membeli ayam/ikan segar, dan tas belanja anyaman besar. Penjual di pasar awalnya bingung, tapi akhirnya sangat mendukung bahkan beberapa memberikan bonus cabai karena senang tidak usah pakai plastik mereka! Yuk dicoba!',
    likes: 24,
    likedByMe: false,
    replies: [
      {
        id: 'r1',
        author: 'Siti_EcoMama',
        content: 'Keren sekali kak Rian! Saya juga selalu bawa toples sendiri kalau beli ayam di pasar. Membantu pedagang menghemat plastik mereka juga.',
        createdAt: '2026-07-16T10:30:00Z'
      },
      {
        id: 'r2',
        author: 'BumiSaver',
        content: 'Inspiratif! Tantangan terbesar saya biasanya menolak kantong plastik kecil pas belanja bumbu dapur eceran. Kantong jaring solusinya ya.',
        createdAt: '2026-07-16T12:15:00Z'
      }
    ],
    createdAt: '2026-07-16T08:24:00Z'
  },
  {
    id: 'p2',
    author: 'Santi_Recycle',
    authorBadge: 'Penyortir Ulung',
    category: 'Recycling',
    title: 'Bagaimana Cara Membersihkan Wadah Plastik Sebelum Masuk Bank Sampah?',
    content: 'Hai kawan EcoQuest! Mau tanya, apakah wadah bekas skincare atau botol minyak harus dicuci bersih mengkilap sebelum disetor ke bank sampah? Ataukah cukup dibilas saja? Kuatirnya sisa minyak malah merusak mesin daur ulang.',
    likes: 12,
    likedByMe: false,
    replies: [
      {
        id: 'r3',
        author: 'Andi_Upcycler',
        content: 'Cukup dibilas dengan sedikit air hangat campur sabun cuci piring secukupnya agar tidak licin berminyak kak. Tidak usah sampai steril mengkilap kok. Yang penting kering saat disetorkan.',
        createdAt: '2026-07-17T02:10:00Z'
      }
    ],
    createdAt: '2026-07-17T01:45:00Z'
  },
  {
    id: 'p3',
    author: 'EcoCreator_Bali',
    authorBadge: 'Duta Zero-Waste',
    category: 'Upcycling',
    title: 'Kreasi Lilin Aromaterapi dari Minyak Jelantah Bekas Dapur',
    content: 'Jangan pernah buang minyak jelantah sisa gorengan ke wastafel karena bisa menyumbat saluran air dan mencemari air tanah! Saya baru saja membuat lilin aromaterapi wangi melati dengan menjernihkan minyak jelantah menggunakan ampas tebu/arang aktif, lalu merebusnya dengan lilin stearin dan minyak esensial jasmine. Nyala apinya bersih dan baunya wangi segar!',
    likes: 38,
    likedByMe: false,
    replies: [],
    createdAt: '2026-07-17T06:30:00Z'
  }
];

export const INITIAL_RECYCLING_SCHEDULES: RecyclingSchedule[] = [
  { id: 's1', day: 'Senin', category: 'organik', time: '08:00', reminderEnabled: true },
  { id: 's2', day: 'Rabu', category: 'plastik', time: '09:00', reminderEnabled: true },
  { id: 's3', day: 'Kamis', category: 'kertas', time: '10:00', reminderEnabled: false },
  { id: 's4', day: 'Sabtu', category: 'b3', time: '11:00', reminderEnabled: true }
];

export const INITIAL_WASTE_LOCATIONS: WasteLocation[] = [
  {
    id: 'l1',
    name: 'Bank Sampah Sektor Hijau',
    type: 'Bank Sampah',
    address: 'Jl. Merdeka No. 45, Kebayoran Baru (Dekat Taman Hijau)',
    acceptedMaterials: ['Plastik (PET/HDPE)', 'Kertas/Karton', 'Logam/Aluminium'],
    coordinates: { x: 35, y: 42 },
    rating: 4.8,
    phone: '0812-3456-7890',
    openHours: '08:00 - 16:00 (Senin - Sabtu)'
  },
  {
    id: 'l2',
    name: 'Pusat Daur Ulang Mandiri',
    type: 'Pusat Daur Ulang',
    address: 'Kawasan Industri Kreatif Blok C5, BSD City',
    acceptedMaterials: ['Plastik', 'Kaca', 'Minyak Jelantah', 'Kardus'],
    coordinates: { x: 62, y: 28 },
    rating: 4.7,
    phone: '0815-9988-7766',
    openHours: '09:00 - 17:00 (Setiap Hari)'
  },
  {
    id: 'l3',
    name: 'Depo Pengumpulan Sampah Elektronik (E-Waste)',
    type: 'Depo Elektronik',
    address: 'Kompleks Pemda Jakarta Barat, Kembangan',
    acceptedMaterials: ['Baterai Bekas', 'Kabel', 'Laptop/HP Rusak', 'Lampu Merkuri'],
    coordinates: { x: 22, y: 71 },
    rating: 4.9,
    phone: '021-5830000',
    openHours: '08:00 - 15:00 (Senin - Jumat)'
  },
  {
    id: 'l4',
    name: 'TPS Terpadu EcoAsri',
    type: 'TPS Terpadu',
    address: 'Jl. Pemuda Raya Gg. Mawar, Rawamangun',
    acceptedMaterials: ['Sampah Organik (Komposter)', 'Sisa Sayur', 'Sampah Kebun'],
    coordinates: { x: 78, y: 65 },
    rating: 4.5,
    phone: '0852-1111-2222',
    openHours: '06:00 - 12:00 (Setiap Hari)'
  }
];

export const LEADERBOARD_PLAYERS = [
  { rank: 1, name: 'BumiSaver_99', points: 450, level: 5, badge: '🌍 Duta Zero-Waste' },
  { rank: 2, name: 'Siti_EcoMama', points: 380, level: 4, badge: '🌱 Prajurit Organik' },
  { rank: 3, name: 'Rian_Hijau99', points: 320, level: 4, badge: '🌱 Prajurit Organik' },
  { rank: 4, name: 'EcoCreator_Bali', points: 280, level: 3, badge: '👑 Penyelamat Bumi' },
  { rank: 5, name: 'Santi_Recycle', points: 210, level: 3, badge: '🎮 Penyortir Ulung' },
];
