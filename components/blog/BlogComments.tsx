"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import CommentCard from "./CommentCard";

export default function BlogComments({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?blogId=${blogId}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [blogId]);


  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    
    setIsPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, content: newCommentText }),
      });
      
      const data = await res.json();
      
      if (data.success) {
       
        setComments([data.comment, ...comments]);
        setNewCommentText(""); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };


  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="mt-16 space-y-10">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl md:text-2xl font-black text-white italic flex items-center gap-3">
          <MessageSquare className="text-primary" />
          Grand Hall Discussion
        </h3>
        
        
        <div className="flex gap-4">
          <div className="hidden sm:block size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
           
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuARrNF78qTP1Qjs8WBhowU7Lkc1VfhyYOOo6WVPbSmDT1HKzHDwczfhNZda_UrGmb4HT8A1z19TeRhMkJ7dKz5dNNEZX6YuOedHRvBa4=" alt="You" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-3 min-w-0">
            <textarea 
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full bg-accent-dark/30 border border-primary/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors resize-none" 
              placeholder="Contribute to the collective knowledge..."
              rows={3}
            />
            <div className="flex justify-end">
              <button 
                onClick={handlePostComment}
                disabled={isPosting || !newCommentText.trim()}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105"
              >
                {isPosting ? "Forging..." : "Post Scroll"}
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="space-y-6 md:space-y-8">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            user={comment.author.username}
            avatar={comment.author.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            time={formatTime(comment.createdAt)}
            content={comment.content}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-slate-500 text-sm italic">No scrolls forged yet. Be the first.</p>
        )}
      </div>
    </div>
  );
}
