"use server";

import { accountRequestApproved, accountRequestReject } from "@/lib/emailTemplates/accountApprovalRequest";
import accountDeletedTemplate from "@/lib/emailTemplates/accountDeletedTemplate";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession";

export const getDetails = async (role:string = "Student") => {

  try {
    const session =  await serverSession();    
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

    if (session.role === "Admin" && role === "Warden") {
      const allWardens = await prisma.admin.findMany({
        where: { role: "Warden" },
        include: {
          profile: true,
          notice: true,
          hostel: true,
        },
      });

      return {
        success: true,
        message: "Fetched all administrators staff",
        data: allWardens,
      };

    } else {
      const users = await prisma.user.findMany({
        include: {
          profile: true,
        },
      });

      return {
        success: true,
        message: "Fetched all students",
        data: users,
      };

    }
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: null,
        message: (error as CustomError).error,
      };
    } else {
      return {
        success: false,
        data: null,
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
};

export const RejectRequest = async  (role:string, data:any)  => {
  
  try {
    const session =  await serverSession();    
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);


    let rejectedUser; 

    if (session.role === "Admin" && data.role === "Warden") {

      rejectedUser = await prisma.admin.update({
        where: { id: data.id },
        data: {
          isVerified: "Rejected",
        }
      });

    } else {

      rejectedUser = await prisma.user.update({
        where: { id:data.id },
        data: {
          isVerified: "Rejected",
        },
        include: {
          profile: true,
        },
      });

    }

    if (!rejectedUser?.id) {
      throw new CustomError(`Failed to reject ${role} account`, false, 404);
    }

    await mailSender(
        rejectedUser.email,
        accountRequestReject(rejectedUser.firstName, rejectedUser.email),
        `❌ Your ${role} account request has been rejected`
      );

    return {
      success: true,
      message: `${rejectedUser.role} account has been rejected.`,
      data: rejectedUser,
    };

  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: null,
        message: (error as CustomError).error,
      };
    } else {
      return {
        success: false,
        data: null,
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
}

export const ApprovedRequest = async  (role:string, data:any)  => {
  
  try {
    const session =  await serverSession();    
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);


    let approvedUser; 

    if (session.role === "Admin" && data.role === "Warden") {
      approvedUser = await prisma.admin.update({
        where: { id: data.id },
        data: {
          isVerified: "Approved",
        },
        include:{

          profile:true
        }
      });

    } else {
      approvedUser = await prisma.user.update({
        where: { id:data.id },
        data: {
          isVerified: "Approved",
        },
        include:{
          profile:true
        }
      });
    }

    if (!approvedUser?.id) {
      throw new CustomError(`Failed to reject ${role} account`, false, 404);
    }

      await mailSender(
          approvedUser.email,
          accountRequestApproved(
            approvedUser.firstName,
            approvedUser.email,
          ),
          `🎉 Your student account has been approved!`,
        );

    return {
      success: true,
      message: `${approvedUser.role} account has been rejected.`,
      data: approvedUser,
    };

  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: null,
        message: (error as CustomError).error,
      };
    } else {
      return {
        success: false,
        data: null,
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
}

export const DeleteAccount = async (role:string, id:string) => {
    try {
  
      let  deletedUser;

      if(role === "Student"){

        await prisma.complaintUpvote.deleteMany({
          where: { userId: id },
        })
  
        // 2. Delete Fees
        await prisma.fees.deleteMany({
          where: { userId: id },
        })
  
        // 3. Delete Outings
        await prisma.outing.deleteMany({
          where: { studentId: id },
        })
  
        // 4. Delete Attendance
        await prisma.attendance.deleteMany({
          where: { userId: id },
        })
  
        // 5. Delete Complaints raised by user
        await prisma.complaint.deleteMany({
          where: { raisedById: id },
        })
  
        // 6. Delete Profile
        await prisma.profile.deleteMany({
          where: { userId: id },
        })

         deletedUser = await prisma.user.delete({
          where: { id },
        });

      }else {

        await prisma.notice.deleteMany({
          where: { adminId: id },
        })
  
        // 2. Delete Hostels (and their rooms through cascading)
        await prisma.hostel.deleteMany({
          where: { adminId: id },
        })
  
        // 3. Delete Complaints resolved by admin
        await prisma.complaint.updateMany({
          where: { resolvedById: id },
          data: { resolvedById: null },
        })
  
        // 4. Delete Profile
        await prisma.profile.deleteMany({
          where: { adminId: id },
        })
  

        deletedUser = await prisma.admin.delete({
          where: { id },
        });
      }
      
      if (!deletedUser) {
        throw new CustomError(`Failed to delete ${role} account.`, false, 404);
      }
  
      // Send email after successful deletion
      await mailSender(
        deletedUser.email,
        accountDeletedTemplate(deletedUser.firstName, role),
        `⚠️ Your ${role} account has been deleted`,
      );
  
      return  {
        success: true,
        message: `${role} account deleted successfully.`,
        data: deletedUser,
      };

    } catch (error) {
      console.log(error)

      if (error instanceof CustomError) {
        return {
          success: error.success,
          message: error.error,
          data:null
        }
      } else {
        const errMessage = (error as Error).message;
        return  {
          success: false,
          message: errMessage || "Something went wrong",
          data:null
        }
      }
    }
}