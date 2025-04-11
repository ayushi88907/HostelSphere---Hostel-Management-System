import { NextRequest, NextResponse } from "next/server";
import {
  AdminRegisterSchema,
  passwordRegex,
  studentRegisterSchema,
} from "@/common/types";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { adminAccountCreated } from "@/lib/emailTemplates/admintWarden";

type ReqData = {
  userData: any;
};

export const POST = async (req: NextRequest) => {
  try {
    // await ensureDatabaseConnection();

    const data: ReqData = await req.json(); // data : { userdata, otp }

    const parseData =
      data.userData.role !== "Student"
        ? AdminRegisterSchema.safeParse(data.userData)
        : studentRegisterSchema.safeParse(data.userData);

    if (!parseData.success) {
      return NextResponse.json(
        {
          message:
            parseData.error.issues.slice(-1)[0].message || "Invalid Details",
        },
        { status: 400 }
      );
    }

    console.log(parseData);

    let isAlreadExist;
    if (parseData.data.role === "Student") {
      delete parseData.data.acceptTerms;

      isAlreadExist = await prisma.user.findFirst({
        where:{email:parseData.data.email}
      });

      if(isAlreadExist && isAlreadExist.id){
        throw new CustomError(
          `Student with this email is already exists`,
          false,
          403
        );
      }
    }

    if (parseData.data.role === "Admin" || parseData.data.role === "Warden") {

      isAlreadExist = await prisma.admin.findFirst({
        where: {
          email: parseData.data.email
        }
      });

      if(isAlreadExist && isAlreadExist.id){
        throw new CustomError(
          `Wardent with this email is already exists`,
          false,
          403
        );
      }

    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    const hashedPassword = bcrypt.hashSync(parseData.data.password, salt);
    parseData.data.password = hashedPassword;

    let createdUser;

    if (parseData.data.role === "Student") {
      delete parseData.data.acceptTerms;

      createdUser = await prisma.user.create({
        data: {
          ...parseData.data,
          isVerified: "Approved",
          profile: {
            create: { department: parseData.data.courseName },
          },
          complaint: {
            create: [],
          },
          fees: {
            create: [],
          },
        },
      });
    }

    if (parseData.data.role === "Admin" || parseData.data.role === "Warden") {

      createdUser = await prisma.admin.create({
        data: {
          ...parseData.data,
          profile: {
            create: { department: parseData.data.department },
          },
          notice: {
            create: [],
          },
          hostel: {
            create: parseData.data.hostel?.map((hostel) => ({
              hostelName: hostel.hostelName, 
              roomCount: 0,    
            })),
          },
        },
      });

    }

    if (!createdUser?.id) {
      throw new CustomError(
        `Failed to create ${parseData.data.role} account`,
        false,
        404
      );
    }

    await mailSender(
      data.userData.email,
      adminAccountCreated(
        parseData.data.firstName,
        parseData.data.email,
        data.userData.password,
        parseData.data.role
      ),
      `Congratulations! Your ${parseData.data.role} account has been successfully created`
    );

    return NextResponse.json(
      {
        success: true,
        message: `${parseData.data.role} account successfully created.`,
        data: createdUser,
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

// Get All Wardens
export const GET = async () => {
  try {
    const allWardens = await prisma.admin.findMany(
      { where:{role: "Warden"},
      include: {
        profile: true,
        notice: true,
        hostel: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Fetched all administrators staff",
      data: allWardens,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};