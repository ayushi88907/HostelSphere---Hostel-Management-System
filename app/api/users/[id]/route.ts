// app/api/users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        profile: true,
        complaint: true,
        fees: true,
        // include other relations if needed
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fetched user successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
