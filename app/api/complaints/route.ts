import { complaint } from "@/common/types"
import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession"
import { NextRequest, NextResponse } from "next/server";


type ComplaintData  = Zod.infer<typeof complaint >

export const POST  = async(req:NextRequest) => {

    const data:ComplaintData = await req.json();

    try {
        const session = await serverSession();
        if(!session) 
            throw new CustomError("Unauthorised Access.", false, 401);
        
        if(session.role !== "Student") 
            throw new CustomError("Only student can raise complaints.", false, 401);

        const parsedData = complaint.safeParse(data);
        
        if (!parsedData.success) throw new CustomError("Some fields are missing.", false, 401);
        
        const newComplaint = await prisma.complaint.create({ 
            data:{...data, userId: session.id}
        })

        if(!newComplaint || !newComplaint.id) 
            throw new CustomError("Raise new Complaint faild.", false, 401);
        
        return NextResponse.json({
            success:true,
            data: newComplaint, 
            message: "Complaint raise successfully."
        }, {status: 200})
        
    } catch (error) {
        if(error instanceof CustomError){
            return NextResponse.json({
                success:false,
                data: null, 
                message: error.error
            }, {status: error.status})
        }else{
            return NextResponse.json({
                success:false,
                data: null, 
                message: (error as Error).message
            }, {status: 500})
        }
    }

}