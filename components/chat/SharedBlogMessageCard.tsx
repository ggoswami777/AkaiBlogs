import Link from "next/link";
import type { SharedBlogPreview } from "@/types/chat";

export default function SharedBlogMessageCard({ blog }: { blog: SharedBlogPreview }) {
  return (
    <Link
      href={`/akaiBlogs/blog/${blog.id}`}
      className="mt-3 block overflow-hidden rounded-xl border border-white/10 bg-black/25 transition-all hover:border-primary/40 hover:bg-black/40 group"
    >
      {blog.coverImage && (
        <div className="h-36 w-full overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-3" style={{ background: "rgba(45,27,27,0.4)" }}>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Blog Post</span>
        </div>
        <p className="line-clamp-2 text-xs font-bold leading-snug text-white">{blog.title}</p>
        <p className="mt-0.5 text-[10px] text-primary">@{blog.author.username}</p>
        {blog.excerpt && (
          <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{blog.excerpt}</p>
        )}
        <div className="mt-3 w-full rounded-lg bg-primary/20 py-1.5 text-center text-[11px] font-bold text-white transition-colors group-hover:bg-primary">
          Read Post
        </div>
      </div>
    </Link>
  );
}
