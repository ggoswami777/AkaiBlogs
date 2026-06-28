import { LogOut, X } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({
  isOpen,
  isLoggingOut,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-primary/20 bg-[#140a0a] p-6 shadow-2xl shadow-black/70">
        <button
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-white disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <LogOut size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              Session
            </p>
            <h3 className="text-lg font-black text-white">Logout?</h3>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          You will be signed out and redirected to the home page.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
