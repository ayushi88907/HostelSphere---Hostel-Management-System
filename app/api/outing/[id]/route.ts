"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { id } = await req.json();

  try {
    const outingPass = await prisma.outing.findUnique({
      where: { id },
    });

    if (!outingPass || !outingPass.id) {
      return NextResponse.json(
        { success: false, message: "Gate Pass not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: outingPass,
      message: "Gate Pass fetched successfully",
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
