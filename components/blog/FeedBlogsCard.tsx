import { useLikeStore } from "@/store/useLikeStore";
import { Bookmark, Ellipsis, Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeedBlogsCard = ({ blog }: any) => {
  const { likedBlogs, likesCount, toggleLike, setInitialState, isLoading } = useLikeStore();
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username: string; avatarUrl: string | null } | null>(null);
  const [commentsCount, setCommentsCount] = useState<number>(blog.commentsCount ?? blog.comments ?? 0);

  useEffect(() => {
    setInitialState(blog.id, blog.isLikedByCurrentUser || false, blog.likesCount || 0);
  }, [blog, setInitialState]);

  useEffect(() => {
    if (isCommentModalOpen && !userProfile) {
      fetch("/api/profile/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setUserProfile({
              username: data.profile.username,
              avatarUrl: data.profile.avatarUrl,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isCommentModalOpen, userProfile]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: blog.id, content: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentsCount((prev: number) => prev + 1);
        setIsCommentModalOpen(false);
        setCommentText("");
      } else {
        alert(data.message || "Failed to post comment");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const isLiked = likedBlogs[blog.id] || false;
  const totalLikes = likesCount[blog.id] ?? (blog.likesCount || 0);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const wasLiked = isLiked;
    await toggleLike(blog.id);
    if (!wasLiked) {
      setShowHeartOverlay(true);
      setTimeout(() => {
        setShowHeartOverlay(false);
      }, 800);
    }
  };

  return (
    <div key={blog.id} className="space-y-6">
      <Link href={`/akaiBlogs/blog/${blog.id}`} className="block">
        <article className="glass rounded-xl overflow-hidden card-hover transition-all flex flex-col group">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-charcoal border border-white/10 overflow-hidden">
                <img
                  alt="Author"
                  src={blog.authorImage}
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{blog.author}</h4>
                <p className="text-[9px] text-slate-500">
                  {blog.time} <span className="text-primary">{blog.category}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                <Ellipsis />
              </span>
            </button>
          </div>

          {/* Banner Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              alt="Feed Post"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={blog.postImage}
            />
            {showHeartOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
                <Heart 
                  className="text-primary fill-primary animate-heart-burst drop-shadow-[0_0_20px_rgba(234,42,51,0.8)]" 
                  size={72} 
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-serif-jp text-white mb-3 group-hover:text-primary transition-colors leading-tight">
              {blog.title}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
              {blog.excerpt}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-5">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={isLoading[blog.id]}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    <Heart className={isLiked ? "fill-primary text-primary" : ""} size={18} />
                  </span>
                  <span className="text-[10px] font-bold">{totalLikes}</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsCommentModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    <MessageSquare size={18} />
                  </span>
                  <span className="text-[10px] font-bold">{commentsCount}</span>
                </button>

                {/* Share Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    <Share2 size={18} />
                  </span>
                </button>
              </div>

              {/* Bookmark Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  <Bookmark size={18} />
                </span>
              </button>
            </div>
          </div>
        </article>
      </Link>

      {isCommentModalOpen && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-obsidian border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setIsCommentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-charcoal border border-white/10 overflow-hidden flex-shrink-0">
                <img
                  alt="Profile"
                  src={userProfile?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {userProfile?.username || "Loading..."}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Posting to: <span className="text-primary">{blog.title.length > 25 ? `${blog.title.slice(0, 25)}...` : blog.title}</span>
                </p>
              </div>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              maxLength={500}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-xs focus:outline-none focus:border-primary text-slate-100 placeholder:text-slate-600 resize-none transition-colors"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsCommentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostComment}
                disabled={isPosting || !commentText.trim()}
                className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedBlogsCard;
