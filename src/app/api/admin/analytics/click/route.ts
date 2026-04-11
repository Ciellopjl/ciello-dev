import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Check if user is logged in as admin - don't track if they are
    const session = await auth();
    if (session?.user) {
      return NextResponse.json({ skipped: true });
    }

    const { link } = await req.json();

    if (!link) {
      return NextResponse.json({ error: "Link required" }, { status: 400 });
    }

    // 2. Save click to database
    await prisma.linkClick.create({
      data: {
        link: link,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging click:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
