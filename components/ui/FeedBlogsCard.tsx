import { Bookmark, Ellipsis, Heart, MessageSquare, Share, Share2 } from "lucide-react";

const FeedBlogsCard = ({blog}:any) => {
  return (
    <div key={blog.id} className="space-y-6 ">
      <article className="glass rounded-xl overflow-hidden card-hover transition-all flex flex-col group">
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
          <button className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">
              <Ellipsis/>
            </span>
          </button>
        </div>
        <div className="relative h-64 overflow-hidden">
          <img
            alt="Feed Post"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={blog.postImage}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-serif-jp text-white mb-3 group-hover:text-primary transition-colors leading-tight">
           {blog.title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-5">
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">
                  <Heart/>
                </span>
                <span className="text-[10px] font-bold">{blog.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">
                  <MessageSquare/>
                </span>
                <span className="text-[10px] font-bold">{blog.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg"><Share2/></span>
              </button>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">
                <Bookmark/>
              </span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default FeedBlogsCard;
