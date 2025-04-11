
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const outingId = searchParams.get("outingId");

  if (!outingId) return NextResponse.json({ error: "Missing outingId" }, { status: 400 });

  const outing = await prisma.outing.update({
    where: { id: outingId },
    data: {
      approvedByParents: "Approved",
    }
  });

  return NextResponse.redirect(`${process.env.BASE_URL}/outing/parent-confirmed?status=approved`);
}
