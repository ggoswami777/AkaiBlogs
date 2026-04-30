import { House, Compass, Bookmark, User } from "lucide-react";
import Link from "next/link";

const ProfileSidebar = () => {
  return (
    <div className="hidden sticky lg:flex flex-col left-10 top-24 gap-4 h-fit w-64 p-4 rounded-xl bg-primary/5 border border-primary/10">
      <Link href="/akaiBlogs/feed" className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
        <House className="text-primary" size={20} />
        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Feed</p>
      </Link>
      <Link href="/akaiBlogs/feed" className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
        <Compass className="text-primary" size={20} />
        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Discovery</p>
      </Link>
      <Link href="/akaiBlogs/archive" className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
        <Bookmark className="text-primary" size={20} />
        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Saved</p>
      </Link>
      <Link href="/akaiBlogs/profile" className="flex items-center gap-3 px-3 py-3 bg-primary text-white rounded-lg cursor-pointer shadow-md shadow-primary/20">
        <User size={20} />
        <p className="text-sm font-bold">My Profile</p>
      </Link>
      <hr className="border-primary/10 my-2" />
      <button className="w-full bg-primary/10 text-primary font-bold py-3 rounded-lg hover:bg-primary/20 transition-colors">
        Create New Post
      </button>
    </div>
  );
};

export default ProfileSidebar;
