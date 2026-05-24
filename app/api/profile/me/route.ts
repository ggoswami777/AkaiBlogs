import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const userProfile= await prisma.user.findUnique({
      where:{username:activeUser.username},
      include:{
        _count:{
          select:{followedBy:true,following:true,blogs:true}
        }
      }
    })
    if(!userProfile) return NextResponse.json({success:false},{status:404});
    return NextResponse.json({ success: true, 
      profile:{
        ...userProfile,
        followersCount:userProfile._count.followedBy,
        followingCount:userProfile._count.following,
        postsCount:userProfile._count.blogs,
      
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error:"Unauthorized" }, { status: 401 });
  }
}
