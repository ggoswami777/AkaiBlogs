import { TrendingUp } from "lucide-react";

const FeedPageCard = () => {
  return (
    <aside className="hidden md:block md:col-span-4 lg:col-span-3 rounded-lg h-full overflow-y-auto pr-2 no-scrollbar scroll-smooth">
      <div className="flex flex-col gap-5 pb-24">
        <div className="p-8 rounded-lg border bg-obsidian border-white/5">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <span className="uprising- text-primary"><TrendingUp/></span>
            Rising Sun
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4 group cursor-pointer">
              <div className="text-2xl font-black text-slate-800 group-hover:text-primary/40 transition-colors">01</div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-100 group-hover:text-primary transition-colors leading-snug">The Architecture of Silence</h5>
                <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Design</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-primary">favorite</span>
                    2.4k
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="text-2xl font-black text-slate-800 group-hover:text-primary/40 transition-colors">02</div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-100 group-hover:text-primary transition-colors leading-snug">Cyber-Ronin: Remote Work</h5>
                <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Future</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-primary">favorite</span>
                    1.8k
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="text-2xl font-black text-slate-800 group-hover:text-primary/40 transition-colors">03</div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-100 group-hover:text-primary transition-colors leading-snug">Hidden Izakayas Map</h5>
                <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Travel</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-primary">favorite</span>
                    1.2k
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Leaderboard
          </button>
        </div>
        <div className="glass p-8 rounded-lg border bg-obsidian border-white/5 relative overflow-hidden group">
          <h4 className="text-lg font-bold mb-2">Join the Collective</h4>
          <p className="text-slate-400 text-xs mb-6">Weekly chronicles of sharp-edged stories delivered to your shrine.</p>
          <div className="space-y-3">
            <input className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors" placeholder="your@shrine.com" type="email" />
              <button className="w-full bg-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/30 hover:bg-red-600 transition-colors">Subscribe</button>
          </div>
        </div>
        <div className="p-6 rounded-lg bg-obsidian border border-white/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recommended Ronins</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img alt="Sug" className="w-8 h-8 rounded-full border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJlgVCOGcwtHGekEX7XwwbkeokoR-zUDSRSWu2kL3CENPhajErsRZDdXhimcT7Ea77KK3y61SHCvXdgmWHhNXwTgoawTtMQ3UjRdXckGC3mFvQeKqq-4qIjeV2eQ-K9UmLwFib_uWlPSM4BDxBYZojSGBfSd8Thuc1MJcZMk1Ur4rkj5KuxCAF5M1c-k5tbCpvY9bwXPbvKOP7QI-aJdShlemfpmx2NQoTsa-yWmdODA4AOmcVVQRwoOubEfuBa1uNWP9OeDmNyg" />
                  <span className="text-xs font-bold text-white">Aiko Tanaka</span>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline">Follow</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img alt="Sug" className="w-8 h-8 rounded-full border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmbaOSztIu6ENUIT5XH5YC-h8TrSO0UeZFFklwY2fsd6LaiJlIM1t6b3j555GNguBidYCB8pLgGi0T9fy_YYIUaK2ooM3IWIfUDiUiWkih2A6kO5c9EtKvGrjpUQRy7eb_-e-VwAfiI4M62veQLq6XBx7GsQQkdnTe821Rq2-fSve9BYknVGPVJ0zvq8BtY07ZucCvxJ5CpdZlaJ9GPA5lTZMM31pmei8CkBbAhX-wiJkF8mjGnPOPRzBVYvtdRQPOzNPrwLP3LQ" />
                  <span className="text-xs font-bold text-white">Master Jin</span>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FeedPageCard;