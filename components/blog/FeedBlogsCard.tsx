import { useLikeStore } from "@/store/useLikeStore";
import { Bookmark, Ellipsis, Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeedBlogsCard = ({ blog }: any) => {
  const { likedBlogs, likesCount, toggleLike, setInitialState, isLoading } = useLikeStore();
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  useEffect(() => {
    // If the backend feeds likesCount and whether current user liked, set it in store
    setInitialState(blog.id, blog.isLikedByCurrentUser || false, blog.likesCount || 0);
  }, [blog, setInitialState]);

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

                {/* Comment Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    <MessageSquare size={18} />
                  </span>
                  <span className="text-[10px] font-bold">{blog.commentsCount ?? blog.comments ?? 0}</span>
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
    </div>
  );
};

export default FeedBlogsCard;
