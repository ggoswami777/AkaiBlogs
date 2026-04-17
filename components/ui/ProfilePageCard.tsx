import { Grid2x2, Heart, Image, Edit, Share, House, Compass, Bookmark, User,
  MessageSquare, Trash
 } from "lucide-react";

const ProfileCardPage = () => {
  return (
    <>
      <main className="flex justify-center py-5 gap-25">
        <div className="hidden sticky lg:flex flex-col left-10 top-24 gap-4 h-fit w-64 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-primary"><House></House></span>
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Feed</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-primary"><Compass></Compass></span>
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Discovery</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-primary"><Bookmark></Bookmark></span>
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Saved</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 bg-primary text-white rounded-lg cursor-pointer shadow-md shadow-primary/20">
            <span className="material-symbols-outlined"><User></User></span>
            <p className="text-sm font-bold">My Profile</p>
          </div>
          <hr className="border-primary/10 my-2" />
            <button className="w-full bg-primary/10 text-primary font-bold py-3 rounded-lg hover:bg-primary/20 transition-colors">
              Create New Post
            </button>
        </div>
        <div className="flex flex-col max-w-240 flex-1 px-4">
          <div className="flex flex-col @container gap-6 mb-8">
            <div className="flex w-full flex-col gap-6 items-center md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                <div className="relative group">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary shadow-xl" data-alt="Professional portrait of a young man smiling">
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background-dark">
                    <span className="material-symbols-outlined text-sm"><Edit></Edit></span>
                  </button>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight tracking-[-0.015em]">Kenji Sato</h1>
                  <p className="text-primary font-medium">@kenjisato</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">Digital nomad &amp; coffee enthusiast. Sharing my journey through Tokyo's hidden neon streets and quiet temples.</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex flex-1 md:flex-none min-w-[120px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-primary text-white text-sm font-bold hover:brightness-110 transition-all">
                  <span>Edit Profile</span>
                </button>
                <button className="flex items-center justify-center rounded-full h-11 w-11 bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined"><Share></Share></span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-primary/10">
              <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
                <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">1.2k</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Followers</p>
              </div>
              <div className="w-px bg-primary/10 hidden md:block"></div>
              <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
                <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">850</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Following</p>
              </div>
              <div className="w-px bg-primary/10 hidden md:block"></div>
              <div className="flex flex-1 min-w-[100px] flex-col gap-1 items-center">
                <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">42</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Posts</p>
              </div>
            </div>
          </div>

          <div className="flex border-b border-primary/10 mb-6 sticky top-16 bg-background-light dark:bg-background-dark z-40">
            <button className="flex flex-1 items-center justify-center border-b-2 border-primary text-primary pb-3 pt-4 font-bold text-sm">
              <span className="material-symbols-outlined mr-2"><Grid2x2></Grid2x2></span>
              Posts
            </button>
            <button className="flex flex-1 items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 font-bold text-sm hover:text-primary transition-colors">
              <span className="material-symbols-outlined mr-2"><Image></Image></span>
              Media
            </button>
            <button className="flex flex-1 items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 font-bold text-sm hover:text-primary transition-colors">
              <span className="material-symbols-outlined mr-2"><Heart></Heart></span>
              Likes
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all">
              <div className="h-48 md:w-48 w-full shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img alt="Tokyo cityscape at night with neon signs" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Stunning neon lights of Tokyo Shinjuku district at night" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Midnight in Shinjuku</h3>
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 -mt-2 -mr-2">
                      <span className="material-symbols-outlined"><Trash></Trash></span>
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">Found this amazing small ramen shop tucked away behind the main station. Best broth I've had this month!</p>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm"><Heart></Heart></span> 2.4k</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm"><MessageSquare></MessageSquare></span> 156</span>
                  <span className="ml-auto">Oct 24, 2023</span>
                </div>
              </div>
            </div>

            <div className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all">
              <div className="h-48 md:w-48 w-full shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img alt="Quiet zen garden with stones and sand" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Serene Japanese zen garden with carefully raked sand" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCsuL_1udSYH8r1Z3LBdxqz8ressHppnxPzzvsEeRzvomxyyWun5CG0A9KvVnH2oIEJ_sv62s9bomWVL6TpNH2f2EOtMgL9wXRmyDBhMRgcP5Sjb7_1A8u8JFwp19u8-jPSvec6zjsVhVxXdIdBuMgPuOBR3Ph38x6CjhPnsVVfwTmQ63iAo0iFkkHh8bT45iRiYKf6QI377SmMuNh0yOp-wfH0U8y8aamo8pa6dM8pl-JSG71lPonCeQaZjR6ocjxdtFGwbF4IQ" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Finding Zen in the Chaos</h3>
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 -mt-2 -mr-2">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">Even in the world's busiest city, silence is only a temple gate away. Spent the morning at Meiji Jingu.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">favorite</span> 1.8k</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat_bubble</span> 89</span>
                  <span className="ml-auto">Oct 20, 2023</span>
                </div>
              </div>
            </div>

            <div className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all">
              <div className="h-48 md:w-48 w-full shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img alt="Artistic coffee latte art in a dark cafe" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Beautifully crafted latte art in a minimalist ceramic cup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGFzYQJ-FElA9PXTUc9p53s7iUIm0geLKI-1uCLmgJx3S6gtALpCAm8IC2RzHg0jFwxvj63j4SEUNLYUVuTXeIgRtmBVA2PjK1nuXvIY6X2rOAL9xXet8uB9_RGKIuJEy84eboVy8PNnIyZh-NpbAO_-Dflf3xkmgF6Df7-0mx0MZlhG8H79T2f-9pIvyy4LLxkhcTYxHxYZKW9THXpJ6Miw_e5H1GNdSh2q0WqLZq2wW5R7G6-fL3wflFjjkPsKLIQT-pkRdN5w" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Tokyo Coffee Culture</h3>
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 -mt-2 -mr-2">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">The attention to detail in these specialty shops is unreal. This pour-over took 10 minutes but was worth every second.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">favorite</span> 3.1k</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat_bubble</span> 243</span>
                  <span className="ml-auto">Oct 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-20"></div>
        </div>
      </main>
    </>
  )
}

export default ProfileCardPage;