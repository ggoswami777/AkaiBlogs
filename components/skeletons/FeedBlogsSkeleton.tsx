const FeedBlogsSkeleton = () => {
  return (
    <div className="space-y-6">
      <article className="glass rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
              <div className="h-2 w-16 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 w-4 bg-white/10 rounded animate-pulse"></div>
        </div>
        <div className="relative h-64 bg-white/10 animate-pulse"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded animate-pulse"></div>
            <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
            <div className="flex items-center gap-5">
              <div className="h-5 w-8 bg-white/10 rounded animate-pulse"></div>
              <div className="h-5 w-8 bg-white/10 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-5 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default FeedBlogsSkeleton;
