import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import accountDeletedTemplate from "@/lib/emailTemplates/accountDeletedTemplate";

export const DELETE = async (req: NextRequest) => {
  try {
    const { id, email, firstName, role }: any = await req.json();

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      throw new CustomError(`Failed to delete ${role} account.`, false, 404);
    }

    // Send email after successful deletion
    await mailSender(
      email,
      `⚠️ Your ${role} account has been deleted`,
      accountDeletedTemplate(firstName, role)
    );

    return NextResponse.json(
      {
        success: true,
        message: `${role} account deleted successfully.`,
        data: deletedUser,
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
