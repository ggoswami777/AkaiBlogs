interface ProfileStatsProps {
  followers: string;
  following: string;
  posts: number;
}

const ProfileStats = ({ followers, following, posts }: ProfileStatsProps) => {
  return (
    <div className="flex flex-wrap gap-4 py-4 border-y border-primary/10">
      <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
        <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">{followers}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Followers</p>
      </div>
      <div className="w-px bg-primary/10 hidden md:block"></div>
      <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
        <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">{following}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Following</p>
      </div>
      <div className="w-px bg-primary/10 hidden md:block"></div>
      <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
        <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">{posts}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Posts</p>
      </div>
    </div>
  );
};

export default ProfileStats;
