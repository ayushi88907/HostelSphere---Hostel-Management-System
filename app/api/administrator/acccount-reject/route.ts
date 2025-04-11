import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { accountRequestReject } from "@/lib/emailTemplates/accountApprovalRequest";

export const POST = async (req: NextRequest) => {
  try {
    const { id, email, firstName, role }: any = await req.json();

    const rejectedUser = await prisma.user.update({
      where: { id },
      data: {
        isVerified: "Rejected",
      },
    });

    if (!rejectedUser?.id) {
      throw new CustomError(`Failed to reject ${role} account`, false, 404);
    }

    // Send rejection email to student/admin/warden
    await mailSender(
      email,
      `❌ Your ${role} account request has been rejected`,
      accountRequestReject(firstName, email)
    );

    return NextResponse.json(
      {
        success: true,
        message: `${role} account has been rejected.`,
        data: rejectedUser,
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
