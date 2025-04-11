import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { userId } = await req.json();

    const existing = await prisma.complaintUpvote.findUnique({
      where: {
        complaintId_userId: {
          complaintId: params.id,
          userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Already upvoted" }, { status: 400 });
    }

    const upvote = await prisma.complaintUpvote.create({
      data: {
        complaintId: params.id,
        userId,
      },
    });

    return NextResponse.json({ success: true, message: "Complaint upvoted", data: upvote });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};
