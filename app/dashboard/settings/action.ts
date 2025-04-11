"use server";

import accountDeletedTemplate from "@/lib/emailTemplates/accountDeletedTemplate";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession";

export default async function deleteAccount() {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

    let deletedUser;

    if (session.role === "Student") {
      deletedUser = await prisma.user.delete({
        where: { id:session.id },
      });
    } else {
      deletedUser = await prisma.admin.delete({
        where: { id:session.id },
      });
    }

    if (!deletedUser) {
      throw new CustomError(
        `Failed to delete ${session.role} account.`,
        false,
        404
      );
    }

    // Send email after successful deletion
    await mailSender(
        deletedUser.email,
      `⚠️ Your ${deletedUser.role} account has been deleted`,
      accountDeletedTemplate(deletedUser.firstName, deletedUser.role)
    );

    return  {
        success: true,
        message: `${session.role} account deleted successfully.`,
        data: null,
      };

  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: error.success,
        message: error.error,
        data: null,
      }
    } else {
      const errMessage = (error as Error).message;
      return {
        success: false,
        message: errMessage || "Something went wrong",
        data: null,
      }  
    }
  }
}
