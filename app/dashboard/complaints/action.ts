"use server";

import { complaint } from "@/common/types"
import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession"


type ComplaintData  = Zod.infer<typeof complaint >

export const raiseNewComplaint  = async(data:ComplaintData) => {

    try {
        const session = await serverSession();
        if(!session) 
            throw new CustomError("Unauthorised Access.", false, 401);
        
        if(session.role !== "Student") 
            throw new CustomError("Only student can raise complaints.", false, 401);

        const parsedData = complaint.safeParse(data);
        
        if (!parsedData.success) throw new CustomError("Some fields are missing.", false, 401);
        
        const newComplaint = await prisma.complaint.create({ 
            data:{
                ...data, 
                userId: session.id,
                // images :  data.images ? data.images.map(String) : [], // cloudinary upload url
            }
        })

        if(!newComplaint || !newComplaint.id) 
            throw new CustomError("Raise new Complaint faild.", false, 401);
        
        return {
            success:true,
            data: newComplaint, 
            message: "Complaint raise successfully."
        }
        
    } catch (error) {
        if(error instanceof CustomError){
            return {
                success:false,
                data: null, 
                message: error.error
            }
        }else{
            return {
                success:false,
                data: null, 
                message: (error as Error).message || "Something went wrong."
            }
        }
    }

}

export const getAllComplaints = async () => {
    try {
        const session = await serverSession();
        if(!session) 
            throw new CustomError("Unauthorised Access.", false, 401);

        const allComplaints = await prisma.complaint.findMany({
            include: {
              user: true,
            },
          })

        return {
            success:true,
            data: allComplaints, 
            message: "Complaint fetch successfully."
        }

    }catch (error){
        if(error instanceof CustomError){
            return {
                success:false,
                data: null, 
                message: error.error
            }
        }else{
            return {
                success:false,
                data: null, 
                message: (error as Error).message || "Something went wrong."
            }
        }
    }
}