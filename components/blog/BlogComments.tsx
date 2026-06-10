"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import CommentCard from "./CommentCard";
import { getAuthUserServer } from "@/lib/authHelper";

export default function BlogComments({ blogId,currentUser,blogAuthorId }: { blogId: string,currentUser?: { userId: string; username: string } | null; blogAuthorId: string }) {
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
  const handleDeleteComment=(commentId:string)=>{
    setComments(comments.filter((c)=>c.id!==commentId));
  };
  const handleUpdateComment=(commentId:string,newContent:string)=>{
    setComments(
      comments.map((c)=>(c.id===commentId)?{...c,content:newContent}:c)
    )
  }
    return (
    <div className="mt-16 space-y-10">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl md:text-2xl font-black text-white italic flex items-center gap-3">
          <MessageSquare className="text-primary" />
          Grand Hall Discussion
        </h3>
        
        <div className="flex gap-4">
          <div className="hidden sm:block size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
            <img src="data:image/jpeg;base64,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" alt="You" className="w-full h-full object-cover" />
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
            id={comment.id}
            user={comment.author.username}
            avatar={comment.author.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            time={formatTime(comment.createdAt)}
            content={comment.content}
            authorId={comment.authorId}
            currentUserId={currentUser?.userId}
            currentUserRole={currentUser?.username === "admin" ? "admin" : "user"}
            isBlogOwner={currentUser?.userId === blogAuthorId} // FIXED: Checking if the current user is the blog owner
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-slate-500 text-sm italic">No scrolls forged yet. Be the first.</p>
        )}
      </div>
    </div>
  );
} 