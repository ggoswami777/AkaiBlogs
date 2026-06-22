"use client";


import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, Loader2, Save, X } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

type EditableProfile = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

type ProfileEditModalProps = {
  isOpen: boolean;
  profile: EditableProfile;
  onClose: () => void;
  onSaved: (profile: EditableProfile) => void;
};

const fallbackAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ";

const ProfileEditModal = ({
  isOpen,
  profile,
  onClose,
  onSaved,
}: ProfileEditModalProps) => {
 
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || fallbackAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("avatarUploader");

 
  useEffect(() => {
    if (!isOpen) return;
    setUsername(profile.username);
    setBio(profile.bio || "");
    setAvatarUrl(profile.avatarUrl || "");
    setAvatarPreview(profile.avatarUrl || fallbackAvatar);
    setSelectedFile(null);
    setError("");
  }, [isOpen, profile]);

  if (!isOpen) return null;

 
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    setIsSaving(true);

    try {
      let nextAvatarUrl = avatarUrl;

      if (selectedFile) {
        const uploadRes = await startUpload([selectedFile]);
       
        const uploadedFile = uploadRes?.[0] as { url?: string; ufsUrl?: string } | undefined;
        const uploadedUrl = uploadedFile?.url || uploadedFile?.ufsUrl;
        if (!uploadedUrl) throw new Error("Avatar upload failed.");
        nextAvatarUrl = uploadedUrl;
      }

      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          bio: bio.trim(),
          avatarUrl: nextAvatarUrl,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update profile.");

      onSaved(data.profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isSaving || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-primary/20 bg-[#140a0a] shadow-2xl shadow-black/70">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Ronin Identity
            </p>
            <h2 className="mt-1 text-xl font-black text-white">Edit Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Profile preview"
                className="size-28 rounded-full border-4 border-primary object-cover shadow-xl shadow-primary/20"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="absolute bottom-0 right-0 rounded-full border-2 border-[#140a0a] bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Camera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-white disabled:opacity-50"
            >
              Replace Profile Picture
            </button>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={24}
              className="w-full rounded-xl border border-white/[0.06] bg-obsidian px-4 py-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-primary/50"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={250}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.06] bg-obsidian px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-slate-600 focus:border-primary/50"
              placeholder="Write something about your path..."
            />
            <p className="mt-2 text-right text-[10px] font-bold tracking-wider text-slate-600">
              {bio.length} / 250
            </p>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl border border-white/[0.08] px-6 py-3 text-sm font-bold text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isBusy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {isBusy ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
