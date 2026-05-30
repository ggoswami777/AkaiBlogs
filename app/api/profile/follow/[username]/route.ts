import { getAuthUserServer } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest,
  { params }: { params: Promise<{ username: string }> }){
    try {
        const activeUser=await getAuthUserServer();
        if(!activeUser){
            return NextResponse.json({ success: false, message: "Unauthorized" },{status:401});
        }
        const {username}=await params;
        if(username===activeUser.username){
            return NextResponse.json({success:false,message:"You can not follow yourself"},{status:400})
        }
        const targetUser=await prisma.user.findUnique({
            where:{
                username
            }
        })
        if(!targetUser){
            return NextResponse.json({success:false,message:"User not found"},{status:404})
        }
        const existingFollow=await prisma.follows.findUnique({
            where:{
                followerId_followingId:{
                    followerId:activeUser.userId,
                    followingId:targetUser.id
                }
            }
        })
        if(existingFollow){
            // do unfollow
            await prisma.follows.delete({
                where:{
                followerId_followingId:{
                    followerId:activeUser.userId,
                    followingId:targetUser.id
                }
            }
            })
            return NextResponse.json({success:true,message:"Unfollowed successfully",isfollowing:false})
        }
        else{
            // do follow
            await prisma.follows.create({
                data:{
                    followerId:activeUser.userId,
                    followingId:targetUser.id
                }
            })
            return NextResponse.json({success:true,message:"Followed successfully",isfollowing:true})
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false,message:"Error occured in follow api"},{status:404})
    }
    
}