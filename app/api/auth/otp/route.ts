import { optSentEmailInfo } from "@/lib/emailTemplates/otpSent";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"
import otpGenerator from 'otp-generator'

export const POST = async(req:NextRequest)=>{
    const data = await req.json()

    console.log(data) 

  try {
    // await ensureDatabaseConnection();

    let User:any;
    if (!data.email) {
      throw new CustomError("Invalid Email", false, 403);
    }

    if (data.role === "Student") {
      User = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (User && User.isVerified === "Pending") {
        throw new CustomError("Please wait for admin approval", false, 403);
      }

    } else {
      User = await prisma.admin.findFirst({
        where: {
          email: data.email,
        },
      });
    }

        if(User && User.id){
            throw new CustomError("Email already Exist", false, 404)
        }

        //delete previous all otp
        const deleteOtp = await prisma.otp.deleteMany({
            where:{
                email:data.email
            }
        })

        //create new otp and send it to the user
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});


        const createOtp = await prisma.otp.create({
            data:{
                email:data.email,
                otp:otp,
                expiresAt:new Date(Date.now() + 5*60*1000)
            }
        })
    
        if(!createOtp.id){
            throw new Error("Otp generation failed")
        }

    await mailSender(
      data.email,
      optSentEmailInfo(otp),
      "Your OTP for Hostel Management System"
    );

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
    
  } catch (error) {
    const err = (error as Error).message;
    return NextResponse.json(
      {
        success: false,
        message: err,
      },
      {
        status: 500,
      }
    );
  }
};
