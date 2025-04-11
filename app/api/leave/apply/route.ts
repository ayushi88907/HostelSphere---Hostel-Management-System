// app/api/leave/apply/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    const { studentId, outingDate, returnDate, outingPurpose } = data;

    if (!studentId || !outingDate || !returnDate || !outingPurpose) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const student = await prisma.user.findUnique({ where: { id:studentId } });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const outing = await prisma.outing.create({
      data: {
        studentId,
        outingDate: new Date(outingDate),
        returnDate: new Date(returnDate),
        outingPurpose,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Leave application submitted successfully",
      data: outing,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
};
