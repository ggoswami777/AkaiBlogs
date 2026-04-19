import { Grid2x2, Image as ImageIcon, Heart } from "lucide-react";

const ProfileTabs = () => {
  return (
    <div className="flex border-b border-primary/10 mb-6 sticky top-16 bg-background-light dark:bg-background-dark z-40">
      <button className="flex flex-1 items-center justify-center border-b-2 border-primary text-primary pb-3 pt-4 font-bold text-sm">
        <Grid2x2 className="mr-2" size={18} />
        Posts
      </button>
      <button className="flex flex-1 items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 font-bold text-sm hover:text-primary transition-colors">
        <ImageIcon className="mr-2" size={18} />
        Media
      </button>
      <button className="flex flex-1 items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 font-bold text-sm hover:text-primary transition-colors">
        <Heart className="mr-2" size={18} />
        Likes
      </button>
    </div>
  );
};

export default ProfileTabs;
