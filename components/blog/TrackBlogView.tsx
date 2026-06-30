"use client"
import { useEffect } from "react"

export default function TrackBlogView({blogId}:{blogId:string}){
    useEffect(()=>{
        fetch("/api/akaiBlogs/view",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({blogId}),
        }).catch(()=>{});
    },[blogId]);
    return null;
}