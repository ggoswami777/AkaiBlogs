import { Edit, Share } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
}

const ProfileHeader = ({ name, username, bio, avatarUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-6 items-center md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
        <div className="relative group">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary shadow-xl"
            style={{ backgroundImage: `url(${avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ'})` }}
          >
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background-dark hover:scale-110 transition-transform">
            <Edit size={14} />
          </button>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight tracking-tight">{name}</h1>
          <p className="text-primary font-medium">@{username}</p>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">{bio}</p>
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <button className="flex flex-1 md:flex-none min-w-[120px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-primary text-white text-sm font-bold hover:brightness-110 active:scale-95 transition-all">
          <span>Edit Profile</span>
        </button>
        <button className="flex items-center justify-center rounded-full h-11 w-11 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
          <Share size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
