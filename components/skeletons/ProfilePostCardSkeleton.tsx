const ProfilePostCardSkeleton = () => {
  return (
    <article className="glass rounded-lg overflow-hidden p-4 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
      </div>
      <div className="h-48 bg-white/10 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/10 rounded"></div>
        <div className="h-3 w-5/6 bg-white/10 rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 bg-white/10 rounded"></div>
          <div className="h-4 w-12 bg-white/10 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-white/10 rounded"></div>
      </div>
    </article>
  );
};

export default ProfilePostCardSkeleton;
