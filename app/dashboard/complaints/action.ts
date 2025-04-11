"use server";

import { complaint } from "@/common/types";
import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession";

type ComplaintData = Zod.infer<typeof complaint>;

export const raiseNewComplaint = async (data: any) => {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

    if (session.role !== "Student")
      throw new CustomError("Only student can raise complaints.", false, 401);

    const parsedData = complaint.safeParse(data);

    if (!parsedData.success)
      throw new CustomError("Some fields are missing.", false, 401);

    const newComplaint = await prisma.complaint.create({
      data: {
        ...data,
        raisedById: session.id,
      },
      include:{
        raisedBy: true,
        upvotes: true,
        resolvedBy: true,
      }
    });

    if (!newComplaint || !newComplaint.id)
      throw new CustomError("Raise new Complaint faild.", false, 401);

    return {
      success: true,
      data: newComplaint,
      message: "Complaint raise successfully.",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: null,
        message: error.error,
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

export const getAllComplaints = async () => {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

    const allComplaints = await prisma.complaint.findMany({
      include: {
        raisedBy: true,
        upvotes: true,
        resolvedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!allComplaints)
      throw new CustomError("faild to fetch complaints.", false, 401);

    return {
      success: true,
      data: allComplaints,
      message: "Complaint fetch successfully.",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: [],
        message: error.error,
      };
    } else {
      return {
        success: false,
        data: [],
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
};

export const updateComplaint = async (id: string, status: any, resolvedMessage:any = "") => {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

      const updated = await prisma.complaint.update({
        where: { id: id },
        data: {
          status,
          resolvedById : session.id,
          resolvedMessage,
        },
        include: {
            raisedBy: true,
            upvotes: true,
            resolvedBy: true,
          },
      });

    if (!updated || !updated.id)
      throw new CustomError("faild to update complaint.", false, 401);

    return {
      success: true,
      data: updated,
      message: "Complaint update successfully.",
    };

  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: [],
        message: error.error,
      };
    } else {
      return {
        success: false,
        data: [],
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
};

export const deleteComplaint = async (id: string) => {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);

    const deleteComplaint = await prisma.complaint.delete({ 
        where: { 
            id,
            raisedById:session.id 
        } 
    });

    if (!deleteComplaint)
      throw new CustomError("faild to delete complaints.", false, 401);

    return {
      success: true,
      data: null,
      message: "Complaint delete successfully.",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: [],
        message: error.error,
      };
    } else {
      return {
        success: false,
        data: [],
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
};

export const upvoteComplaint = async (id: string) => {
  try {
    const session = await serverSession();
    if (!session) throw new CustomError("Unauthorised Access.", false, 401);
    
        const existing = await prisma.complaintUpvote.findUnique({
          where: {
            complaintId_userId: {
              complaintId: id,
              userId:session.id,
            },
          },
          
        });
    
        if (existing) {
          throw new CustomError("Already upvoted" , false, 400 );
        }
    
        const upvote = await prisma.complaintUpvote.create({
          data: {
            complaintId: id,
            userId:session.id,
          },
        });

        // Fetch updated complaint with upvote count
const updatedComplaint = await prisma.complaint.findMany({
    include: {
      upvotes: true, // Include all upvotes
      raisedBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      resolvedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!updatedComplaint) {
    throw new CustomError("Complaint not found after upvote", false, 404);
  }

    return {
      success: true,
      data: updatedComplaint,
      message: "Complaint upvote successfully.",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        data: [],
        message: error.error,
      };
    } else {
      return {
        success: false,
        data: [],
        message: (error as Error).message || "Something went wrong.",
      };
    }
  }
};
