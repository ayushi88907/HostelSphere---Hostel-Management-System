import { complaint } from "@/common/types"
import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession"
import { NextRequest, NextResponse } from "next/server";


// Student raises a complaint
export const POST = async (req: NextRequest) => {
  try {
    const { title, description, raisedById } = await req.json();

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        raisedById,
      },
    });

    return NextResponse.json({ success: true, data: complaint });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};

// Admin/Warden fetch all complaints
export const GET = async () => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        raisedBy: true,
        upvotes: true,
        resolvedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};