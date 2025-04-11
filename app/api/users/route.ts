// app/api/users/route.ts (GET all users)
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        // add more relations if needed (e.g. complaints, fees, etc.)
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fetched all users successfully",
        data: users,
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
