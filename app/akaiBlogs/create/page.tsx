"use client";

import { useState, useRef } from "react";
import {
  ImagePlus,
  X,
  ChevronDown,
  FileText,
  Save,
  Send,
  Sparkles,
  Type,
  AlignLeft,
  Tag,
  Eye,
} from "lucide-react";

const categories = [
  "Technology",
  "Design",
  "Travel",
  "Culture",
  "Future",
  "Lifestyle",
  "Philosophy",
  "Art",
];

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="min-h-screen">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Page Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles size={18} className="text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
              Craft a New Scroll
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Create <span className="text-primary">Post</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg">
            Forge your thoughts into a scroll. Fill in the details below and
            share your story with the collective.
          </p>
        </div>

        {/* ── Form Container ── */}
        <div className="space-y-6">
          {/* ─── Post Title ─── */}
          <div className="group">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <Type size={14} className="text-primary/60" />
              Post Title
            </label>
            <div className="relative">
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title for your scroll..."
                className="w-full bg-obsidian border border-white/[0.06] rounded-2xl px-6 py-4 text-white text-lg font-semibold placeholder:text-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_30px_rgba(234,42,51,0.06)] transition-all duration-300"
              />
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>
            <p className="text-right text-[10px] text-slate-600 mt-2 font-bold tracking-wider">
              {title.length} / 120
            </p>
          </div>

          {/* ─── Cover Image ─── */}
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <ImagePlus size={14} className="text-primary/60" />
              Cover Image
            </label>

            {!coverPreview ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative bg-obsidian border-2 border-dashed rounded-2xl p-10 sm:p-14 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                  isDragging
                    ? "border-primary/60 bg-primary/[0.04] shadow-[0_0_40px_rgba(234,42,51,0.08)]"
                    : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.01]"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                    isDragging
                      ? "bg-primary/20 scale-110"
                      : "bg-white/[0.03] group-hover:bg-primary/10"
                  }`}
                >
                  <ImagePlus
                    size={32}
                    className={`transition-colors duration-300 ${
                      isDragging
                        ? "text-primary"
                        : "text-slate-600 group-hover:text-primary/70"
                    }`}
                  />
                </div>
                <p className="text-sm font-bold text-slate-400 mb-1">
                  {isDragging ? "Release to upload" : "Drop your image here"}
                </p>
                <p className="text-[11px] text-slate-600">
                  or{" "}
                  <span className="text-primary/80 font-bold hover:text-primary">
                    browse files
                  </span>{" "}
                  · PNG, JPG up to 5MB
                </p>
                {/* decorative corner accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary/20 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary/20 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden group border border-white/[0.06]">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  onClick={removeCover}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:bg-primary/80 hover:border-primary/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-bold text-white hover:bg-primary/80 hover:border-primary/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  Change Image
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="cover-image-input"
            />
          </div>

          {/* ─── Excerpt ─── */}
          <div className="group">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <AlignLeft size={14} className="text-primary/60" />
              Excerpt
            </label>
            <div className="relative">
              <textarea
                id="post-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a short summary that hooks readers in..."
                rows={3}
                className="w-full bg-obsidian border border-white/[0.06] rounded-2xl px-6 py-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_30px_rgba(234,42,51,0.06)] transition-all duration-300 resize-none leading-relaxed"
              />
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>
            <p className="text-right text-[10px] text-slate-600 mt-2 font-bold tracking-wider">
              {excerpt.length} / 280
            </p>
          </div>

          {/* ─── Category ─── */}
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <Tag size={14} className="text-primary/60" />
              Category
            </label>
            <div className="relative">
              <button
                id="category-selector"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full bg-obsidian border border-white/[0.06] rounded-2xl px-6 py-4 flex items-center justify-between text-left hover:border-white/15 focus:outline-none focus:border-primary/40 transition-all duration-300"
              >
                <span
                  className={`text-sm font-semibold ${selectedCategory ? "text-white" : "text-slate-600"}`}
                >
                  {selectedCategory || "Select a category"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform duration-300 ${isCategoryOpen ? "rotate-180 text-primary" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#140a0a] border border-white/[0.08] rounded-2xl overflow-hidden z-20 shadow-2xl shadow-black/60 backdrop-blur-xl animate-in">
                  <div className="p-2 max-h-60 overflow-y-auto no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          selectedCategory === cat
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-slate-300 hover:bg-white/[0.04] hover:text-white border border-transparent"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Content (Blog Body placeholder) ─── */}
          <div className="group">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <FileText size={14} className="text-primary/60" />
              Content
            </label>
            <div className="relative">
              <textarea
                id="post-content"
                placeholder="Begin writing your scroll here... Let the ink flow."
                rows={10}
                className="w-full bg-obsidian border border-white/[0.06] rounded-2xl px-6 py-5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_30px_rgba(234,42,51,0.06)] transition-all duration-300 resize-none leading-relaxed"
              />
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* ─── Actions ─── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 pb-10 border-t border-white/[0.05]">
            {/* Left: Preview (optional) */}
            <button
              id="preview-btn"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-slate-400 text-sm font-bold hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
            >
              <Eye size={16} />
              Preview
            </button>

            {/* Right: Draft & Publish */}
            <div className="flex items-center gap-3">
              <button
                id="save-draft-btn"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-bold hover:bg-white/[0.08] hover:text-white hover:border-white/15 transition-all duration-300 active:scale-[0.97]"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                id="publish-btn"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
              >
                <Send size={16} />
                Publish
              </button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
