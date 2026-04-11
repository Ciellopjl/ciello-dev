import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalViews = await prisma.pageView.count();

    return NextResponse.json({ totalViews });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
