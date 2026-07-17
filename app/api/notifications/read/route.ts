import { getAuthUser } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const activeUser = getAuthUser(request);
    const { notificationId, all } = await request.json();

    if (all) {
      await prisma.notification.updateMany({
        where: { receiverId: activeUser.userId, read: false },
        data: { read: true }
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, receiverId: activeUser.userId },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
