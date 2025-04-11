import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { accountRequestApproved } from "@/lib/emailTemplates/accountApprovalRequest";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    const { id, updateData } = await req.json();

    const approvedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        isVerified: "Approved",
      },
      include: {
        profile: true,
      },
    });

    if (!approvedUser?.id) {
      throw new CustomError(
        `Failed to approve ${updateData.role} account`,
        false,
        404
      );
    }

    // Send email to student after approval
    await mailSender(
      approvedUser.email,
      `🎉 Your student account has been approved!`,
      accountRequestApproved(
        approvedUser.firstName,
        approvedUser.email,
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: `Student account has been successfully approved.`,
        data: approvedUser,
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: error.success,
          message: error.error,
        },
        { status: error.status }
      );
    } else {
      const errMessage = (error as Error).message;
      return NextResponse.json(
        {
          success: false,
          message: errMessage || "Something went wrong",
        },
        { status: 500 }
      );
    }
  }
};