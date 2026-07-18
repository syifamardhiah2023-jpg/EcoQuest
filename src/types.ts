export interface UserProfile {
  id: string;
  username: string;
  email: string;
  points: number;
  badges: string[];
  level: number;
  streak: number;
  weeklyWasteLogged: number; // in grams
  lastLoggedDate?: string;
}

export interface TrashItem {
  id: string;
  name: string;
  category: 'organik' | 'anorganik';
  points: number;
  description: string;
  recyclingMethod: string;
  icon: string; // Emoji representing the trash item
}

export interface ForumPost {
  id: string;
  author: string;
  authorBadge?: string;
  category: 'ZeroWaste' | 'Recycling' | 'Upcycling' | 'Edukasi' | 'Diskusi';
  title: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  replies: ForumReply[];
  createdAt: string;
}

export interface ForumReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  icon: string;
  unlockedAt?: string;
  color: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  status: 'available' | 'completed';
  type: 'game' | 'read' | 'log' | 'forum';
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
  quizSolved?: boolean;
  read?: boolean;
}

export interface WasteLocation {
  id: string;
  name: string;
  type: 'Bank Sampah' | 'TPS Terpadu' | 'Pusat Daur Ulang' | 'Depo Elektronik';
  address: string;
  acceptedMaterials: string[];
  coordinates: { x: number; y: number }; // Percentage coordinate on mock map (0 to 100)
  rating: number;
  phone: string;
  openHours: string;
}

export interface RecyclingSchedule {
  id: string;
  day: string; // 'Senin', 'Selasa', etc.
  category: 'organik' | 'anorganik' | 'kertas' | 'plastik' | 'b3';
  time: string;
  reminderEnabled: boolean;
}

export interface WasteLog {
  id: string;
  date: string;
  organic: number; // in grams
  inorganic: number; // in grams
}
