import React from "react";
import HomePageGlassCard from "@/components/ui/HomePageGlassCard";
import HomeBlogCard from "@/components/blog/HomeBlogCard";
import { HomePageGlassCardTypeArray, HomeBlogCardTypeArray } from "@/types";
import { ArrowRight, Book, GroupIcon, LucideSwords, Shield, Sword } from "lucide-react";
import Link from "next/link";

const temporaryData: HomePageGlassCardTypeArray = [
  { id: 1, title: "Active Ronin", data: "12.5k", icon: <GroupIcon/> },
  { id: 2, title: "Stories Told", data: "48.2k", icon: <Book/> },
  { id: 3, title: "Clans Formed", data: "150", icon: <LucideSwords/> },
];

const temporaryBlogData: HomeBlogCardTypeArray = [
  {
    id: 1,
    title: "Neon Kyoto Nights: A Cyber-Samurai Journey",
    author: "Takeshi Kovacs",
    category: "Metropolis",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdt99f_Xg753lkOyc5TROFj5NqVahQdzPsw0jgk-sHj8dFWehLsMQC9Cf8q_DILchUmZJSlX_SVwwmHUxQ7_267tQ7Dr82RyXVIxSmCjPq763XDuWDvZldijXvU6HDkT6vya7y-g7SBp0tN-CnpCCcEWBRF18pKsMxtbNZnOdeG9P6PWVqzqN4_HLBsKoJUb5YpzCkmCE-YBgoR3lpCnesziH5KWS7VBuvf3uoF1MytLP9x-WMBauyPwyOHX_z80yeGdhakR0vqA"
  },
  {
    id: 2,
    title: "The Art of the Silent Blade: Lessons in Patience",
    author: "Miyamoto S.",
    category: "Philosophy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl4t95vgBs0JBsDGoazNegKBWyxqPlMnmvvHCCjPNvvENHwVHsPQUMx0eAPj9Tg0fBkMrzC9dYZIGPvo08EG9-4J7MF-D2oYEWu4ggSVd2bdaT23l8P7OXpY8Zhat3dJDYTbODvRMjLyxE7Nu18DUWC6TqexuKskA9r4FrSvgOuXNQSyna2EIxaa0yoqkTx8SMg4jPG66prRae4p7oI5QHQ-DFwopnRbpIxIJ9H5z2sl-edkjeDPQxM_7aUf3dHAu0-6g3eAiWuA"
  },
  {
    id: 3,
    title: "The Last Shogun's Legacy: Echoes of the Past",
    author: "Hanzo Hattori",
    category: "Tradition",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnan_2MfPDTjWB-52IccEWtmr83HFB57vRTLlvgs8tvKVokGyOrr8MmLHJFGZMdDrH-JXCBGdd4ywkH2htz8q5_CwPWDx8i2bYykfLkDrnDqp87SxlhHZjWEE2KLQVX4cE5xLLQTsDT7y1dW88ds15k-0TEGzH7xru0VVhM1pDsAZAoE7iJxODrBZZyud7RqxCa6cX6AFmFor0oMHRcLgbva7rXK7uHKZili5MOcR6mLJlNjWv8wGaPOW0yS74BF30VamSUNLfMA"
  }
];

const Page = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-background-dark/80 z-10"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZg4mlRi1Nvab-NPcK7zgUs6BuEeoxwJQoWKfOo2OND14sbq5g7mZxBwccAQHbPLqd-MEY112HrLXSck48GXmPEeozoJi09vlQWnzhEN5BH4Qd1uAFeeu4E3uH5A_YZYOhWAmep6F-uOS5UwIUpEUSiMxfQ_72FU9aHvdKurSBT9oa3w54AW3vkYVAAmDB5hY0UYLFEPoJvkbXJFnOonysMy9dPFeWGJfvuNdU0ANo5puHuXB0CJysgk1AIuDSbfer9PJ0IVG4aw"
            alt="Samurai in the wind"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            Live in the Shogunate
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
            Stories from the <br />
            <span className="text-primary italic">Edge of the Blade</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            A Japanese-themed social blogging sanctuary for the modern ronin. Forge your legacy, share your path, and find your clan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-extrabold transition-all transform hover:translate-y-[-2px] shadow-xl shadow-primary/40">
              Begin Your Journey
            </button>
            </Link>
            
            <button className="glass-panel text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-extrabold transition-all">
              View the Archive
            </button>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-7xl mx-auto px-6 -mt-5 md:mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {temporaryData.map((item) => (
            <HomePageGlassCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* Featured Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Editor&apos;s Selection</h2>
            <h3 className="text-4xl font-black text-white">Featured Scrolls</h3>
          </div>
          <a className="text-primary font-bold flex items-center gap-1 w-auto hover:underline" href="#">
            View All <span className="material-symbols-outlined"><ArrowRight/></span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {temporaryBlogData.map((blog) => (
            <HomeBlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-[3rem] overflow-hidden glass-panel border border-primary/20 p-12 md:p-24 text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem] text-primary rotate-12"><Sword/></span>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">Join the Collective</h2>
            <p className="text-xl text-slate-400 font-medium">
              Don&apos;t walk the path alone. Connect with thousands of storytellers, martial artists, and thinkers in the Zolo community.
            </p>
            <div className="pt-6">
              <button className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-full text-xl font-black transition-all transform hover:scale-105 shadow-2xl shadow-primary/30">
                Claim Your Title
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 font-bold uppercase tracking-widest">
              <span>1,204 Ronin Online</span>
              <span className="size-1 rounded-full bg-primary/40"></span>
              <span>Join 12 Free Clans Today</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
