import { Heart, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProfilePostCardProps {
  id:string,
  title: string;
  excerpt: string;
  image?: string;
  likes: number;
  comments: number;
  date: string;
  onDelete?: () => void;
}

const ProfilePostCard = ({ id,title, excerpt, image, likes, comments, date, onDelete }: ProfilePostCardProps) => {
  return (
    <div className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all">
      {image && (<div className="h-48 md:w-48 w-full shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>)}
      <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
        <div>
          <div className="flex justify-between items-start gap-4">
            <Link href={`/akaiBlogs/blog/${id}`} className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 break-words">
                {title}
              </h3>
            </Link>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onDelete) onDelete();
              }}
              className="text-slate-400 hover:text-primary transition-colors p-2 -mt-2 -mr-2 shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <Link href={`/akaiBlogs/blog/${id}`}><p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-sm md:text-base">{excerpt}</p></Link>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1"><Heart size={14} className="text-primary" /> {likes}</span>
          <span className="flex items-center gap-1"><MessageSquare size={14} /> {comments}</span>
          <span className="ml-auto">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
