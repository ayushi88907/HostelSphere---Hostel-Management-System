import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get single complaint (with status tracking)
export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        raisedBy: true,
        resolvedBy: true,
        upvotes: true,
      },
    });

    if (!complaint) {
      return NextResponse.json({ success: false, message: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: complaint });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};

// Resolve complaint (by admin/warden)
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { status, resolvedById } = await req.json();

    const updated = await prisma.complaint.update({
      where: { id: params.id },
      data: {
        status,
        resolvedById,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};

// Delete complaint
export const DELETE = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.complaint.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};
