import { Home, Compass, Plus, Bell, User } from "lucide-react"

export default function FooterNavigation() {
  return (
  <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 py-2 flex justify-around items-center z-50">
    <button className="flex flex-col items-center p-2 text-slate-500">
      <span className="material-symbols-outlined"><Home></Home></span>
      <span className="text-[10px] font-bold">Home</span>
    </button>
    <button className="flex flex-col items-center p-2 text-slate-500">
      <span className="material-symbols-outlined"><Compass></Compass></span>
      <span className="text-[10px] font-bold">Explore</span>
    </button>
    <button className="flex items-center justify-center p-2 bg-primary text-white rounded-full size-12 -mt-8 shadow-lg shadow-primary/40 border-4 border-background-dark">
      <span className="material-symbols-outlined text-3xl"><Plus></Plus></span>
    </button>
    <button className="flex flex-col items-center p-2 text-slate-500">
      <span className="material-symbols-outlined"><Bell></Bell></span>
      <span className="text-[10px] font-bold">Alerts</span>
    </button>
    <button className="flex flex-col items-center p-2 text-primary">
      <span className="material-symbols-outlined"><User></User></span>
      <span className="text-[10px] font-bold">Profile</span>
    </button>
  </nav>
  )
}