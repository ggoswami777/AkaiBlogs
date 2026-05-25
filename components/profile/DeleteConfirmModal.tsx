import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blogTitle: string;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  blogTitle,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl glass animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Warning Icon and Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Delete Scroll</h3>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-0.5">Confirm Annihilation</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete the scroll <span className="text-primary font-bold">"{blogTitle}"</span>?
          </p>
          <p className="text-xs text-slate-500 mt-2">
            This action is permanent and cannot be undone in the scroll archives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-450 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            Retreat
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-bold text-white bg-primary hover:brightness-110 active:scale-95 rounded-xl shadow-lg shadow-primary/20 transition-all"
          >
            Annihilate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
