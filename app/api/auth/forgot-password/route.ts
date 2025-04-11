import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import otpGenerator from "otp-generator";

import bcrypt from "bcrypt";
import { mailSender } from "@/lib/mailSender";
import { optSentEmailInfo } from "@/lib/emailTemplates/otpSent";


export const POST = async (req: NextRequest) => {
  const { step, email, role, otp, newPassword } = await req.json();

  try {
    if (!email || !role) {
      throw new CustomError("Email and role are required", false, 400);
    }

    // Step 1: Send OTP
    if (step === 1) {
      let user;

      if (role === "Student") {
        user = await prisma.user.findFirst({ where: { email } });
      } else {
        user = await prisma.admin.findFirst({ where: { email } });
      }

      if (!user || !user.id) {
        throw new CustomError("Invalid email address", false, 403);
      }

      // Delete any existing OTPs
      await prisma.otp.deleteMany({ where: { email } });

      const generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const newOtp = await prisma.otp.create({
        data: {
          email,
          otp: generatedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
        },
      });

      if (!newOtp.id) {
        throw new Error("OTP generation failed");
      }

      await mailSender(
        email,
        optSentEmailInfo(generatedOtp),
        "Password Reset OTP"
      );

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
      });
    }

    // Step 2: Verify OTP
    if (step === 2) {
      if (!otp) throw new CustomError("OTP is required", false, 400);

      const existingOtp = await prisma.otp.findFirst({ where: { email } });

      if (!existingOtp || existingOtp.otp !== otp) {
        throw new CustomError("Invalid or expired OTP", false, 401);
      }

      if (new Date(existingOtp.expiresAt) < new Date()) {
        throw new CustomError("OTP has expired", false, 401);
      }

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    // Step 3: Update password
    if (step === 3) {
      if (!otp || !newPassword) {
        throw new CustomError("OTP and new password are required", false, 400);
      }

      const validOtp = await prisma.otp.findFirst({ where: { email } });

      if (!validOtp || validOtp.otp !== otp) {
        throw new CustomError("Invalid or expired OTP", false, 401);
      }



      const hashedPassword = await bcrypt.hash(newPassword, 10);

      if (role === "Student") {
        await prisma.user.update({
          //@ts-ignore
          where: { email },
          data: { password: hashedPassword },
        });
      } else {
        await prisma.admin.update({
          //@ts-ignore
          where: { email },
          data: { password: hashedPassword },
        });
      }

      await prisma.otp.deleteMany({ where: { email } }); // Clean up

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }

    throw new CustomError("Invalid step provided", false, 400);

  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: error.success, message: error.error },
        { status: error.status }
      );
    } else {
      return NextResponse.json(
        { success: false, message: (error as Error).message || "Something went wrong" },
        { status: 500 }
      );
    }
  }
};
