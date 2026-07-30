import { create } from "zustand";

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  email?: string;
  bio?: string | null;
  publicKey?: string | null;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
};

interface ProfileStore {
  profile: UserProfile | null;
  isLoadingProfile: boolean;
  hasFetched: boolean;
  fetchProfile: () => Promise<void>;
}
export const userProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
    isLoadingProfile:false,
    hasFetched:false,
    fetchProfile:async()=>{
        if(get().hasFetched) return;
        set({isLoadingProfile:true});
        try {
            const res = await fetch("/api/profile/me");
            const data=await res.json();
            if(data.success){
                set({profile:data.profile, hasFetched:true,});
            }else{
              set({hasFetched:true})
            }
            
        } catch (error) {
            set({hasFetched:true})
            console.error("Error fetching profile:",error);

        }finally{
            set({isLoadingProfile:false})
        }
    }
}))