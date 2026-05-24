import { create } from "zustand";

interface ProfileStore{
    profile:any,
    isLoadingProfile:boolean,
    hasFetched:boolean,
    fetchProfile:()=>Promise<void>;
}
export const userProfileStore=create<ProfileStore>((set,get)=>({
    profile:null,
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
            }
            
        } catch (error) {
            console.error("Error fetching profile:",error);

        }finally{
            set({isLoadingProfile:false})
        }
    }
}))