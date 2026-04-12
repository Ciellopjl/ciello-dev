import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { link } = await req.json();

    if (!link) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 });
    }

    await prisma.linkClick.create({
      data: {
        link,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LinkClick Tracking Error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
