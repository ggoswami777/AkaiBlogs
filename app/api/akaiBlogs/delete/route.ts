import { getAuthUser } from "@/lib/authHelper";
import { invalidateAllFeedCaches } from "@/lib/feed/invalidateFeedCache";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Find the blog to delete
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Validate that the logged-in user is indeed the author of this blog
    if (blog.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You are not the author of this blog" },
        { status: 403 }
      );
    }

    // Perform the deletion
    await prisma.blog.delete({
      where: { id: blogId },
    });
    await invalidateAllFeedCaches();
    return NextResponse.json({
      success: true,
      message: "Blog successfully deleted",
    });
  } catch (error: any) {
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete blog",
      },
      { status }
    );
  }
}
