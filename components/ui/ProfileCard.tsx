import { Bookmark, BookOpen, Landmark, Settings } from "lucide-react";
import Link from "next/link";

const ProfileCard = () => {
  return (
    <aside className="hidden lg:block lg:col-span-3 rounded-lg h-full overflow-y-auto pr-2 no-scrollbar">
      <div className="flex flex-col gap-5">
        <div className="glass p-8 rounded-lg border border-white/5 bg-obsidian">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 mb-4 overflow-hidden p-1">
            <Link href={`/akaiBlogs/profile`} >
              <img
                alt="Kenji Sato"
                className="w-full h-full rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ"
              />
              </Link>
            </div>
            <h3 className="text-xl font-bold text-white">Kenji Sato</h3>
            <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">
              Digital Ronin
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/10 mb-8">
            <div className="text-center px-2">
              <p className="text-xl font-black text-white">1.2k</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                Followers
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-xl font-black text-white">482</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                Following
              </p>
            </div>
          </div>
          <nav className="space-y-2">
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold transition-all border border-primary/20"
              href="#"
            >
              <span className="material-symbols-outlined"><BookOpen/></span>
              <span className="text-sm">My Scrolls</span>
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined"><Bookmark/></span>
              <span className="text-sm">Bookmarks</span>
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined"><Landmark/></span>
              <span className="text-sm">The Dojo</span>
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined"><Settings/></span>
              <span className="text-sm">Settings</span>
            </a>
          </nav>
        </div>
        <div className="glass p-6 rounded-lg border border-white/5 bg-obsidian">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Active Guilds
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/5 hover:border-primary/40 cursor-pointer transition-colors">
              TOKYO_PUNK
            </span>
            <span className="bg-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/5 hover:border-primary/40 cursor-pointer transition-colors">
              ZEN_LIFE
            </span>
            <span className="bg-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/5 hover:border-primary/40 cursor-pointer transition-colors">
              KATANA_CRAFT
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileCard;
