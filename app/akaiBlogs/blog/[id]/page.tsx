import React from 'react';
import { blogsData } from '@/lib/data';
import Navbar from '@/components/layout/Navbar';
import { notFound } from 'next/navigation';
import { ThumbsUp, ThumbsDown, Share2, Bookmark, MessageSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BlogComments from '@/components/blog/BlogComments';
import { getAuthUserServer } from '@/lib/authHelper';


interface ContentNode {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  [key: string]: any; 
}

interface BlockNode {
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'code' | string;
  children?: ContentNode[];
}


function RenderBlogContent({ content }: { content: string }) {
  try {
    
    const blocks: BlockNode[] = JSON.parse(content);

    if (!Array.isArray(blocks)) {
      throw new Error("Parsed content is not a valid block array");
    }

    return (
      <div className="space-y-6 text-slate-800 dark:text-slate-200">
        {blocks.map((block, blockIdx) => {
         
          const renderChildren = () =>
            block.children?.map((child, childIdx) => {
              let element: React.ReactNode = child.text || '';

              if (child.bold) {
                element = <strong key={childIdx}>{element}</strong>;
              }
              if (child.italic) {
                element = <em key={childIdx}>{element}</em>;
              }

              return <React.Fragment key={childIdx}>{element}</React.Fragment>;
            });

        
          switch (block.type) {
            case 'heading-1':
              return (
                <h1 key={blockIdx} className="text-3xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4">
                  {renderChildren()}
                </h1>
              );
            case 'heading-2':
              return (
                <h2 key={blockIdx} className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  {renderChildren()}
                </h2>
              );
            case 'heading-3':
              return (
                <h3 key={blockIdx} className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
                  {renderChildren()}
                </h3>
              );
            case 'code':
              return (
                <pre key={blockIdx} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm overflow-x-auto my-4 border border-slate-800">
                  <code>{block.children?.map((c) => c.text).join('')}</code>
                </pre>
              );
            case 'paragraph':
            default:
              return (
                <p key={blockIdx} className="text-base md:text-lg leading-relaxed mb-4">
                  {renderChildren()}
                </p>
              );
          }
        })}
      </div>
    );
  } catch (error) {
    
    return (
      <div 
        className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const activeUser = await getAuthUserServer();
  const blog = await prisma.blog.findUnique({
    where: { id: id },
    include: {
      author: true,
    }
  });

  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const authorName = blog.author.username;
  const authorAvatar = blog.author.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ";
  const coverImage = blog.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto w-full flex flex-col">
          {/* Category Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-sm font-bold tracking-wide uppercase">
              {blog.category}
            </span>
            <span className="px-4 py-1 rounded-full bg-slate-200 dark:bg-accent-dark text-slate-600 dark:text-slate-400 text-[10px] md:text-sm font-bold tracking-wide uppercase">
              Chronicles
            </span>
          </div>

          {/* Title */}
          <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            {blog.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl font-medium leading-relaxed mb-10">
            {blog.excerpt || "A newly forged Scroll."}
          </p>

          {/* Author Card */}
          <div className="flex items-center gap-4 mb-10 p-4 md:p-6 rounded-2xl bg-slate-100 dark:bg-primary/5 border border-primary/10">
            <div 
              className="size-12 md:size-16 rounded-full bg-cover bg-center border-2 border-primary/20 flex-shrink-0" 
              style={{ backgroundImage: `url("${authorAvatar}")` }}
            ></div>
            <div className="flex flex-col min-w-0">
              <p className="text-slate-900 dark:text-white text-base md:text-lg font-bold truncate">{authorName}</p>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">
                <span>{formattedDate || "Oct 24, 2024"}</span>
                <span className="size-1 rounded-full bg-primary/30"></span>
                <span className="text-primary font-bold uppercase text-[9px] md:text-[10px] tracking-widest"> 8 min read</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full mb-12 aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 group">
            <img 
              src={coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* Content Parser Component replacing dangerouslySetInnerHTML */}
          <article className="overflow-hidden">
            <RenderBlogContent content={blog.content} />
          </article>

         

          {/* Interaction Bar */}
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95">
                  <ThumbsUp size={20} />
                  <span>{blog.likesCount}</span>
                </button>
                <button className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full glass-panel text-slate-400 hover:text-primary transition-colors border-primary/10">
                  <ThumbsDown size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase text-xs sm:text-sm tracking-widest">
                  <MessageSquare size={18} />
                  <span>{blog.commentsCount} Comments</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <BlogComments blogId={blog.id} currentUser={activeUser} blogAuthorId={blog.authorId} />

          {/* Next Post Preview */}
          <div className="mt-24 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] glass-panel border border-primary/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Share2 size={200} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white italic mb-4">Share this Scroll</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto font-medium text-sm md:text-base px-2">Forward this knowledge to your clan and let the discussion begin in the grand halls.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-2">
               <button className="flex items-center justify-center gap-2 px-8 py-3 md:py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform active:scale-95">
                  <Share2 size={18} />
                  Copy Link
               </button>
               <button className="flex items-center justify-center gap-2 px-8 py-3 md:py-4 rounded-full bg-transparent border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                  <Bookmark size={18} />
                  Save Archive
               </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 md:py-20 px-4 border-t border-primary/10 mt-20">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="text-primary mb-6 flex justify-center scale-110 md:scale-150">
            <svg className="size-10" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-2">AkaiBlogs Collective</p>
          <p className="text-slate-600 dark:text-slate-500 text-[9px] md:text-xs">© 2026 Insights from the Edge of the Blade.</p>
        </div>
      </footer>
    </div>
  );
}