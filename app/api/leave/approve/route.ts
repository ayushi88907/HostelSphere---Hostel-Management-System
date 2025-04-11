// app/api/leave/approve/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { leaveId, approverId, status } = await req.json();

    const leave = await prisma.outing.update({
      where: { id: leaveId },
      data: {
        approvalStatus: status,
        approverId,
      },
    });

    if (status === "Approved") {
      // Create absent records for each day
      const startDate = new Date(leave.outingDate);
      const endDate = new Date(leave.returnDate);
      const absents:any = [];

      while (startDate <= endDate) {
        absents.push({
          date: new Date(startDate),
          status: "Leave",
          userId: leave.studentId,
        });
        startDate.setDate(startDate.getDate() + 1);
      }

      await prisma.attendance.createMany({ data: absents });
    }

    return NextResponse.json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
};
