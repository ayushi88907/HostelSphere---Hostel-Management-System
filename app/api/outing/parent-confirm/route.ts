"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
  
    if (!token) {
      return new NextResponse("Invalid or missing token", { status: 400 });
    }
  
    const outing = await prisma.outing.findFirst({
      where: {
        parentApprovalToken: token,
        tokenExpiry: {
          gte: new Date(), // not expired
        },
      },
      include:{
        user:true,
        Admin:true
      }
    });
  
    if (!outing || !outing.id) {
      return NextResponse.json(
        { success: false, message: "Token expired or invalid", data: null },
        { status: 404 }
      );
    }
  
      return NextResponse.json({
        success: true,
        data: {outing:outing, token},
        message: "Gate Pass fetched successfully",
      });

  }
  