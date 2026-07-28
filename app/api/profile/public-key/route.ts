import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, publicKey: true },
    });

    if (!user?.publicKey) {
      return NextResponse.json(
        { success: false, error: "Public key not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      username: user.username,
      publicKey: user.publicKey,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
}

export async function POST(request:NextRequest) {
    try {
        const {userId, username}=getAuthUser(request);
        const {publicKey}=await request.json();
        if(!publicKey || typeof publicKey!=="string"){
            return NextResponse.json({success:false,error:"Invalid public key"},{status:400});
        }
        await prisma.user.update({
            where:{id:userId},
            data:{publicKey},
        })
        const { deleteCache } = await import("@/lib/redis/cache");
        const { cacheKeys } = await import("@/lib/redis/cacheKeys");
        await deleteCache(cacheKeys.profileMe(userId));
        await deleteCache(cacheKeys.publicProfile(username));
        return NextResponse.json({success:true});
    } catch {
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }
}
