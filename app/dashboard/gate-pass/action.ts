"use server";

import { CustomError } from "@/lib/Error";
import { mailSender } from "@/lib/mailSender";
import { prisma } from "@/lib/prisma";
import { serverSession } from "@/lib/serverSession";

export async function createOutingRequest(data: any) {
  const session = await serverSession();
  if (!session || session.role !== "Student") {
    throw new CustomError("Unauthorized", false, 401);
  }

  function mergeDateAndTime(date: string, time: string) {
    return new Date(`${date}T${time}:00`);
  }

  const outingDate = data.outingDate;         // e.g., "2025-04-03"
  const returnDate = data.returnDate;         // e.g., "2025-04-17"
  const leavingTime = data.leavingTime;       // e.g., "13:00"
  const checkOutTime = data.checkOutTime; 

  const outing = await prisma.outing.create({
    data: {
      ...data,
      outingDate: new Date(outingDate),
      returnDate: new Date(returnDate),
      leavingTime: mergeDateAndTime(outingDate, leavingTime),
      checkOutTime: mergeDateAndTime(returnDate, checkOutTime),
      studentId:session.id,
    },
    include:{
      user:true,
      Admin:true,
    }
  });

  if (!outing || !outing.id) {
    throw new CustomError("Failed to generate outing pass", false, 401);
  }

  await mailSender(
    outing.parentsEmail,
    `<p>Your child has requested an outing with the following details:</p>
    <ul>
      <li><b>Reason:</b> ${outing.outingPurpose}</li>
      <li><b>Leave Time:</b> ${outing.leavingTime}</li>
      <li><b>Return Time:</b> ${outing.checkOutTime}</li>
    </ul>
    <p>Please choose an action below:</p>
    <a href="${process.env.BASE_URL}/api/outing/parent/approve?outingId=${outing.id}" style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none;">Approve</a>
    &nbsp;
    <a href="${process.env.BASE_URL}/api/outing/parent/reject?outingId=${outing.id}" style="padding:10px 15px; background:#f44336; color:white; text-decoration:none;">Reject</a>
    <p>Thank you</p>
  `,
    "Parent Approval Needed - Student Outing Request"
  );

  return { success: true, message:"Successfully requested for outing", data:outing };
}

export async function handleOutingStatus(
  outingId: string,
  status: "Approved" | "Rejected" | "Pending"
) {
  const session = await serverSession();
  if (!session || session.role !== "Warden") {
    throw new CustomError("Unauthorized", false, 401);
  }

  const outing = await prisma.outing.update({
    where: { id: outingId },
    data: {
      approvalStatus:status,
    },
    include: {
      user: true,
    },
  });

  if (status === "Rejected")
    return { success: true, message: "Request Rejected" , data:outing};

  // If approved, return outing pass data
  return {
    success: true,
    data: outing,
    message: "Request Approved" 
  };
}

export async function getAllGetPasses () {

  const session = await serverSession();
  if (!session) {
    throw new CustomError("Unauthorized", false, 401);
  }

  let outingPasses ;

  if(session.role === "Student"){
    outingPasses = await prisma.outing.findMany({
      where: { studentId: session.id },
      include: {
        user: true,
        Admin:true
      },
    });

  }else{
    outingPasses = await prisma.outing.findMany({
      include: {
        user: true,
        Admin:true
      },
    });

  }

  // If approved, return outing pass data
  return {
    success: true,
    data: outingPasses,
    message: "Fetch outing pass." 
  };
}