const ProfileCardSkeleton = () => {
  return (
    <aside className="hidden lg:block lg:col-span-3 rounded-lg h-full overflow-y-auto pr-2 no-scrollbar">
      <div className="flex flex-col gap-5">
        {/* Main card skeleton */}
        <div className="glass p-8 rounded-lg border border-white/5 bg-obsidian animate-pulse">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white/10 mb-4 border-4 border-primary/10"></div>
            <div className="h-5 w-28 bg-white/10 rounded mb-2"></div>
            <div className="h-3 w-20 bg-white/10 rounded"></div>
          </div>

          {/* Followers / Following */}
          <div className="grid grid-cols-2 divide-x divide-white/10 mb-8">
            <div className="text-center px-2 space-y-2">
              <div className="h-6 w-10 bg-white/10 rounded mx-auto"></div>
              <div className="h-2 w-14 bg-white/10 rounded mx-auto"></div>
            </div>
            <div className="text-center px-2 space-y-2">
              <div className="h-6 w-10 bg-white/10 rounded mx-auto"></div>
              <div className="h-2 w-14 bg-white/10 rounded mx-auto"></div>
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5"
              >
                <div className="w-5 h-5 rounded bg-white/10"></div>
                <div className="h-3 w-24 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Guilds skeleton */}
        <div className="glass p-6 rounded-lg border border-white/5 bg-obsidian animate-pulse">
          <div className="h-3 w-24 bg-white/10 rounded mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-7 w-24 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileCardSkeleton;
