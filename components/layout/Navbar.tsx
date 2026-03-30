import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 backdrop-blur-[12px]">
      <div className="bg-[#1f141499] w-full max-w-[1600px] rounded-full px-8 py-3 flex items-center justify-between border-primary/10 ">
        {/* logo */}
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-100">
            ZOLO
          </h1>
        </div>
        {/* searchbar */}
        <div className="hidden md:flex items-center gap-10">
          <div className="relative group">
            <input
              className="bg-black/40 border border-white/10 rounded-full px-6 py-1.5 text-sm w-64 focus:outline-none focus:border-primary transition-all"
              placeholder="Search the scrolls..."
              type="text"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/3 -translate-y-1/2 text-slate-500 text-sm w-3 h-3">
              <Search />
            </span>
          </div>
        </div>
        {/* noti and profile */}
        <div className="flex items-center gap-8">
          <button className="text-slate-300 hover:text-primary transition-colors">
            <span className="material-symbols-outlined"><Bell/></span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary/50 p-0.5">
            <img
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
