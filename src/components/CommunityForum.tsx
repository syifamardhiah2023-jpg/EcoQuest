import React, { useState } from 'react';
import { ForumPost, ForumReply } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/mockData';
import { MessageSquare, Heart, Send, Plus, Filter, CornerDownRight, X, Sparkles, User, Award } from 'lucide-react';

interface CommunityForumProps {
  onEarnPoints: (points: number, source: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export default function CommunityForum({ onEarnPoints, onUnlockBadge }: CommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'ZeroWaste' | 'Recycling' | 'Upcycling' | 'Edukasi' | 'Diskusi'>('ZeroWaste');

  // Active post comments state
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const categories = ['All', 'ZeroWaste', 'Recycling', 'Upcycling', 'Edukasi', 'Diskusi'];

  const filteredPosts = posts.filter(post => {
    return selectedCategory === 'All' || post.category === selectedCategory;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likedByMe;
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          likedByMe: !isLiked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      author: 'EcoHero_Saya',
      authorBadge: 'Penyelamat Bumi',
      category: newCategory,
      title: newTitle,
      content: newContent,
      likes: 1,
      likedByMe: true,
      replies: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    setShowNewPostForm(false);
    setNewTitle('');
    setNewContent('');
    
    // Earn points for posting
    onEarnPoints(15, 'Membuat Postingan Komunitas');
    onUnlockBadge('b3'); // Count towards save-the-planet badge
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const newReply: ForumReply = {
      id: `r-${Date.now()}`,
      author: 'EcoHero_Saya',
      content: replyText,
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    }));

    setReplyText('');
    onEarnPoints(5, 'Menanggapi Diskusi Komunitas');
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-md border border-[#e5e9e2] flex flex-col h-full" id="community-forum-container">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
            💬 Forum Komunitas Hijau
          </h2>
          <p className="text-[#8a9a8c] text-sm mt-1">
            Berbagi ide, solusi ramah lingkungan, aksi daur ulang, dan diskusikan gaya hidup zero-waste bersama warga.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer self-start"
          id="write-post-btn"
        >
          <Plus className="w-4 h-4" /> Mulai Diskusi Baru
        </button>
      </div>

      {/* Category filters row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#e5e9e2] scrollbar-thin">
        <span className="text-[#8a9a8c] text-xs font-bold mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#4a6d4d]" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#f0f4ef] text-[#4a6d4d] font-bold'
                : 'bg-[#f0f4ef]/40 hover:bg-[#dee9e1] text-[#2d3a2e]'
            }`}
          >
            #{cat === 'All' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* Discussion Boards */}
      <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#f9fbf8]/50 border border-[#e5e9e2] p-5 md:p-6 rounded-[24px] hover:border-[#ccd5cb] hover:bg-[#f9fbf8] transition-all flex flex-col shadow-2xs"
            >
              {/* Author & Tag */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 bg-[#f0f4ef] rounded-full flex items-center justify-center text-[#4a6d4d]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1a2e1d] block">{post.author}</span>
                    {post.authorBadge && (
                      <span className="text-[10px] text-[#4a6d4d] bg-[#f0f4ef] px-2 py-0.5 rounded flex items-center gap-0.5 font-bold mt-0.5">
                        <Award className="w-3 h-3 text-[#4a6d4d]" /> {post.authorBadge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white text-[#8a9a8c] border border-[#e5e9e2] px-2.5 py-1 rounded-xl font-bold">
                    #{post.category}
                  </span>
                  <span className="text-[10px] text-[#8a9a8c] font-mono font-medium">
                    {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-[#1a2e1d] font-display mt-4 leading-tight tracking-tight">
                {post.title}
              </h3>
              <p className="text-[#2d3a2e] text-xs mt-2.5 leading-relaxed whitespace-pre-wrap font-medium">
                {post.content}
              </p>

              {/* Reactions & Replies Panel */}
              <div className="flex items-center gap-5 mt-5 border-t border-[#e5e9e2] pt-4 text-xs font-bold">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.likedByMe ? 'text-[#b47c5d]' : 'text-[#8a9a8c] hover:text-[#2d3a2e]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-[#b47c5d]' : ''}`} />
                  <span>{post.likes} menyukai</span>
                </button>

                <button
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-[#8a9a8c] hover:text-[#2d3a2e] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#4a6d4d]" />
                  <span>{post.replies.length} Tanggapan</span>
                </button>
              </div>

              {/* Collapsible Replies list */}
              {activePostId === post.id && (
                <div className="mt-4 pt-4 border-t border-[#e5e9e2] space-y-4">
                  {post.replies.length > 0 && (
                    <div className="space-y-3 pl-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2 text-xs bg-white border border-[#edf1eb] p-3.5 rounded-xl shadow-2xs">
                          <CornerDownRight className="w-4 h-4 text-[#4a6d4d] shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold text-[#1a2e1d]">{reply.author}</span>
                            <p className="text-[#2d3a2e] mt-1 leading-relaxed font-medium">{reply.content}</p>
                            <span className="text-[9px] text-[#8a9a8c] block mt-1.5 font-mono">
                              {new Date(reply.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment/reply box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis tanggapan atau solusi ramah lingkungan..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddReply(post.id);
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      className="p-2.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-[#8a9a8c] text-sm font-medium">
            Belum ada diskusi di kategori ini. Jadilah yang pertama memulai!
          </div>
        )}
      </div>

      {/* New Post Modal Form */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-6 max-w-lg w-full border border-[#e5e9e2] shadow-xl relative">
            <button
              onClick={() => setShowNewPostForm(false)}
              className="absolute top-4 right-4 text-[#8a9a8c] hover:text-[#1a2e1d] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#1a2e1d] font-display tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4a6d4d] fill-[#f0f4ef]" /> Mulai Diskusi Komunitas Baru
            </h3>
            <p className="text-[#8a9a8c] text-xs mt-1 font-medium">
              Dapatkan 15 Poin untuk setiap postingan informatif yang dibagikan ke komunitas!
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Judul Diskusi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mengolah Sisa Kulit Jeruk jadi EcoEnzyme"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                  />
                </div>

                <div>
                  <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20"
                  >
                    <option value="ZeroWaste">ZeroWaste</option>
                    <option value="Recycling">Recycling</option>
                    <option value="Upcycling">Upcycling</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Diskusi">Diskusi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#2d3a2e] text-[10px] font-bold uppercase tracking-wide">Konten Diskusi</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Ceritakan pengalamanmu, bagikan resep DIY upcycling, atau tanyakan perihal pengelolaan sampah..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full mt-1 p-3 bg-[#f9fbf8] border border-[#ccd5cb] rounded-xl text-xs text-[#2d3a2e] focus:outline-none focus:ring-2 focus:ring-[#4a6d4d]/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="flex-1 py-2.5 border border-[#ccd5cb] hover:bg-[#f0f4ef] text-[#2d3a2e] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4a6d4d] hover:bg-[#3d5a3f] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center shadow-sm"
                >
                  Terbitkan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
