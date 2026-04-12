import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    const referrer = headerList.get("referer") || "direto";
    
    // Simplistic device detection
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";

    // Simplistic browser detection
    let browser = "outro";
    if (/chrome|chromium|edg/i.test(userAgent)) browser = "chrome";
    else if (/firefox|iceweasel/i.test(userAgent)) browser = "firefox";
    else if (/safari/i.test(userAgent)) browser = "safari";

    const { page } = await req.json();

    await prisma.pageView.create({
      data: {
        page: page || "/",
        device,
        browser,
        referrer: referrer.includes("localhost") ? "direto" : referrer,
        // IP and location would need a 3rd party service or a more complex setup
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PageView Tracking Error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
