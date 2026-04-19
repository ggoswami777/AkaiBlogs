
import React from 'react';
import { blogsData } from '@/lib/data';
import Navbar from '@/components/layout/Navbar';
import { notFound } from 'next/navigation';
import { ThumbsUp, ThumbsDown, Share2, Bookmark, MessageSquare } from 'lucide-react';

export default async function BlogPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const blog = blogsData.find((b) => b.id === id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <Navbar />
      <div className="pt-24"></div> {/* Offset for fixed Navbar */}
      
      <main className="flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col max-w-[800px] flex-1 px-4">
          {/* Category Tags */}
          <div className="mb-6 flex gap-2">
            <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase">
              {blog.category}
            </span>
            <span className="px-4 py-1 rounded-full bg-slate-200 dark:bg-accent-dark text-slate-600 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
              Chronicles
            </span>
          </div>

          {/* Title */}
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            {blog.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl font-medium leading-relaxed mb-10">
            {blog.subtitle || blog.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center gap-4 mb-10 p-6 rounded-2xl bg-slate-100 dark:bg-primary/5 border border-primary/10">
            <div 
              className="size-16 rounded-full bg-cover bg-center border-2 border-primary/20" 
              style={{ backgroundImage: `url("${blog.authorImage}")` }}
            ></div>
            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white text-lg font-bold">{blog.author}</p>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span>{blog.date || "Oct 24, 2024"}</span>
                <span className="size-1 rounded-full bg-primary/30"></span>
                <span className="text-primary font-bold uppercase text-[10px] tracking-widest">{blog.readTime || "8 min read"}</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full mb-12 aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 group">
            <img 
              src={blog.postImage} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* Content */}
          <article 
            className="prose prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Grid Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="aspect-square rounded-2xl overflow-hidden glass-panel border border-primary/20">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUSn_rJzEUarrzFX51tacuCLxkB-OE9Igffd8WTlNPaFC5tz6ufXcE_yc93xCPNiW8SxYpyBnPFyEQoRGqZXp9l0mXmfrY-SzRqVsOa93O5PtHUDuzEjK2AJaxaznF_8AI514ix9D-_4BOwy1F-JDyGBz9O2_LD7I3oHrPOyd375HnC9yj1-lChWqcfko51MaWgWbI3AWoh0T04KjIjHnU2aBVNBdA2FkQ6EOmgkTuUU59fSBS_xrtJszzJ0Y8uzEH98pk5IjSw" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden glass-panel border border-primary/20">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAItxeq0kjJEN6m47RY08QeCtd-CURqOOnYqUnAv8_Iy8e8-lzFYxeDSrGGy6_nWYrhs2HGytXGPbFvosgwPSbKadExynEr9jWWfbLFlSD4qOWWUtz00M5Jt-yLWiQHD0hT-Nokt5Q59__5Osk70GYQuO40q8dEAACFtdfCk7FTTCNTdAHYnUF27Wr3m1SgSCSmDjl2666HMbhtjPvDIxxx0XG2nN7VOTWz87gCVlX5sfypwFj3FqjUY1QrxuGvUqkYp0DaS18QIw" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95">
                  <ThumbsUp size={20} />
                  <span>{blog.likes}</span>
                </button>
                <button className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full glass-panel text-slate-400 hover:text-primary transition-colors border-primary/10">
                  <ThumbsDown size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest">
                  <MessageSquare size={18} />
                  <span>{blog.comments} Comments</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-16 space-y-10">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-black text-white italic flex items-center gap-3">
                <MessageSquare className="text-primary" />
                Grand Hall Discussion
              </h3>
              
              {/* Comment Input */}
              <div className="flex gap-4">
                <div className="hidden sm:block size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuARrNF78qTP1Qjs8WBhowU7Lkc1VfhyYOOo6WVPbSmDT1HKzHDwczfhNZda_UrGmb4HT8A1z19TeRhMkJ7dKz5dNNEZX6YuOedHRvBa4rm3aMj3a7xam19YC7oslObzYbPAMAun1BK-MCE4Xs7vgb00is7arR6xc7R9aumrGsPYSt1WuUA44pU_EZiUsM6LtCrpg8Woxr-YhntVUW_xOcGm3wpG5JxG4f_yX4yGs4Orl3ewnJHPlkJykGJa5CR_7wcgnQA_6t6m-g" alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  <textarea 
                    className="w-full bg-accent-dark/30 border border-primary/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors resize-none" 
                    placeholder="Contribute to the collective knowledge..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105">
                      Post Scroll
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardcoded Comments */}
            <div className="space-y-8">
              {[
                {
                  user: "Takeshi Kovacs",
                  avatar: "https://i.pravatar.cc/100?img=11",
                  time: "2 hours ago",
                  content: "This analysis of the Gion district is spot on. The way silence is integrated into the architecture is truly unique to Kyoto. The shadows tell more than the lights ever could."
                },
                {
                  user: "Miyamoto S.",
                  avatar: "https://i.pravatar.cc/100?img=12",
                  time: "5 hours ago",
                  content: "I've practiced calligraphy in Gion for years, and you've captured exactly how the light feels at twilight. It's a weightless transition that your words mirror perfectly."
                }
              ].map((comment, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-2xl glass-panel border-white/5 transition-all hover:border-primary/20">
                  <div className="size-10 md:size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
                    <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-sm md:text-base">{comment.user}</h4>
                      <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-tighter">{comment.time}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reply</button>
                      <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Honor</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Post Preview */}
          <div className="mt-24 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] glass-panel border border-primary/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Share2 size={200} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white italic mb-4">Share this Scroll</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto font-medium text-sm md:text-base">Forward this knowledge to your clan and let the discussion begin in the grand halls.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform active:scale-95">
                  <Share2 size={18} />
                  Copy Link
               </button>
               <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                  <Bookmark size={18} />
                  Save Archive
               </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-20 px-4 border-t border-primary/10 mt-20">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="text-primary mb-6 flex justify-center scale-125 md:scale-150">
            <svg className="size-10" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-2">AkaiBlogs Collective</p>
          <p className="text-slate-600 dark:text-slate-500 text-[10px] md:text-xs">© 2024 Insights from the Edge of the Blade.</p>
        </div>
      </footer>
    </div>
  );
}
