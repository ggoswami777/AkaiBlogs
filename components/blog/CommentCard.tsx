import React, { useState } from "react";
import { toast } from "react-toastify";
import { MoreVertical, Edit2, Trash2, Copy } from "lucide-react";

export interface CommentCardProps {
  id: string;
  user: string;
  avatar: string;
  time: string;
  content: string;
  currentUserId?: string;
  currentUserRole?: string;
  authorId: string;
  isBlogOwner?: boolean; // FIXED: Prop to identify if the current user owns the parent blog
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
}

export default function CommentCard({
  id,
  user,
  avatar,
  time,
  content,
  currentUserId,
  currentUserRole,
  authorId,
  isBlogOwner = false, // FIXED: Default to false
  onDelete,
  onUpdate,
}: CommentCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // FIXED: State to handle custom delete confirmation modal
  const [editVal, setEditVal] = useState(content);

  const isOwner = currentUserId === authorId;
  const isAdmin = currentUserRole === "admin";
  const canDelete = isOwner || isBlogOwner || isAdmin; // FIXED: Owners, Admins, and Blog Owners can delete comments

  const handleAction = async (action: "edit" | "delete" | "copy") => {
    setShowDropdown(false);
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(content);
        toast.success("Scroll copied!");
        break;
      case "edit":
        setIsEditing(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true); // FIXED: Trigger custom UI modal instead of native confirm()
        break;
    }
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onDelete(id);
        toast.success("Comment deleted!");
      } else {
        toast.error(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const saveEdit = async () => {
    if (!editVal.trim() || editVal === content) {
      setIsEditing(false);
      return;
    }
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editVal }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate(id, editVal);
        setIsEditing(false);
        toast.success("Comment edited!");
      } else {
        toast.error(data.error || "Failed to edit comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="relative flex gap-3 md:gap-4 p-4 md:p-6 rounded-2xl glass-panel border-white/5 transition-all hover:border-primary/20">
      <div className="size-10 md:size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-1 md:space-y-2 min-w-0 flex-1 pr-8">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-white text-sm md:text-base truncate">{user}</h4>
          <span className="text-[9px] md:text-xs text-slate-500 font-medium uppercase tracking-tighter shrink-0">
            {time}
          </span>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="flex-1 bg-accent-dark/30 border border-primary/20 rounded-xl px-3 py-1 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-primary/50"
            />
            <button onClick={saveEdit} className="text-xs font-bold text-primary hover:underline px-2">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditVal(content);
              }}
              className="text-xs font-bold text-slate-500 hover:text-white px-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}

       
      </div>

      {/* Triple Dot Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
        >
          <MoreVertical className="size-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-1 w-32 bg-slate-950 border border-white/10 rounded-md py-1 shadow-xl z-20">
            <button
              onClick={() => handleAction("copy")}
              className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
            >
              <Copy className="size-3" /> Copy
            </button>
            {isOwner && (
              <button
                onClick={() => handleAction("edit")}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
              >
                <Edit2 className="size-3" /> Edit
              </button>
            )}
            {canDelete && ( 
              <button
                onClick={() => handleAction("delete")}
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 className="size-3" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Comment</h3>
            <p className="text-slate-400 text-sm">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
