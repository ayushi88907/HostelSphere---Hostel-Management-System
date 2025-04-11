import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET Single Admin/Warden
export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: params.id },
      include: {
        profile: true,
        notice: true,
        hostel: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};

// UPDATE Admin/Warden
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { password, ...restData } = body;

    let updateData = { ...restData };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData = { ...restData, password: hashedPassword };
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedAdmin });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};

// DELETE Admin/Warden
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.admin.delete({ where: { id: params.id } });
    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};
