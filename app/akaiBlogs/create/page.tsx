"use client";

import { useState } from "react";
import { Loader2, ImageIcon, Bold, Italic, Link2, List, Send, Info, ChevronDown } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    // API logic here
    setTimeout(() => setIsPublishing(false), 2000);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // API logic here
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <main className="flex-1 flex justify-center py-12 px-4 md:px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-white text-4xl font-black tracking-tight">
            Create New Post
          </h1>
          <p className="text-slate-400 text-lg">
            Express yourself and share knowledge with the AkaiBlogs community.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handlePublish}
          className="rounded-3xl p-8 border border-white/10 space-y-8 bg-black/20"
        >
          {/* Post Title */}
          <div className="space-y-2">
            <label className="text-[#ea2a33] text-xs font-bold uppercase tracking-widest ml-1">
              Post Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-6 rounded-full bg-transparent border border-white/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#ea2a33] transition-all font-medium"
              placeholder="Enter a catchy title..."
              type="text"
              required
            />
          </div>

          {/* Category + Cover Image Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[#ea2a33] text-xs font-bold uppercase tracking-widest ml-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-6 appearance-none rounded-full bg-transparent border border-white/20 text-white focus:outline-none focus:border-[#ea2a33] transition-all cursor-pointer"
                  required
                >
                  <option disabled value="" className="bg-[#0a0a0a]">Select a category</option>
                  <option className="bg-[#0a0a0a]" value="Technology">Technology</option>
                  <option className="bg-[#0a0a0a]" value="Design">Design</option>
                  <option className="bg-[#0a0a0a]" value="Lifestyle">Lifestyle</option>
                  <option className="bg-[#0a0a0a]" value="Development">Development</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#ea2a33] text-xs font-bold uppercase tracking-widest ml-1">
                Cover Image URL
              </label>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full h-12 px-6 rounded-full bg-transparent border border-white/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#ea2a33] transition-all"
                placeholder="https://images.unsplash.com/..."
                type="url"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-[#ea2a33] text-xs font-bold uppercase tracking-widest ml-1">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full h-16 py-4 px-6 rounded-[2rem] bg-transparent border border-white/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#ea2a33] transition-all resize-none"
              placeholder="Write a brief, engaging summary of your post..."
            />
          </div>

          {/* Body Content */}
          <div className="space-y-2">
            <label className="text-[#ea2a33] text-xs font-bold uppercase tracking-widest ml-1">
              Body Content
            </label>
            <div className="rounded-[2.5rem] border border-white/20 overflow-hidden bg-transparent">
              {/* Toolbar */}
              <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10">
                <Bold className="text-white/60 hover:text-white cursor-pointer transition-colors" size={16} />
                <Italic className="text-white/60 hover:text-white cursor-pointer transition-colors" size={16} />
                <Link2 className="text-white/60 hover:text-white cursor-pointer transition-colors" size={16} />
                <List className="text-white/60 hover:text-white cursor-pointer transition-colors" size={16} />
                <ImageIcon className="text-white/60 hover:text-white cursor-pointer transition-colors" size={16} />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[300px] p-8 bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none resize-y leading-relaxed"
                placeholder="Tell your story..."
                required
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Info size={14} />
              <span>Your post will be visible to all users after publishing.</span>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                type="button"
                className="flex-1 md:flex-none h-12 px-8 rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Save Draft"}
              </button>
              
              <button
                disabled={isPublishing}
                type="submit"
                className="flex-1 md:flex-none h-12 px-10 rounded-full bg-[#ea2a33] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#ff3d46] transition-all disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Publish Post</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;