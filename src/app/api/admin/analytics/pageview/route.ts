import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Check if user is logged in as admin - don't track if they are
    const session = await auth();
    if (session?.user) {
      return NextResponse.json({ skipped: true });
    }

    const { page } = await req.json();
    const headerList = await headers();
    
    // 2. Extract metadata from headers
    const userAgent = headerList.get("user-agent") || "";
    const referrer = headerList.get("referer") || "direto";
    const country = headerList.get("x-vercel-ip-country") || "Localhost";
    const city = headerList.get("x-vercel-ip-city") || "Desconhecido";

    // 3. Simple device detection
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";

    // 4. Browser detection
    let browser = "Outro";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    // 5. Detect origin (referrer)
    const origin = referrer.includes("google") ? "Google" 
      : referrer.includes("instagram") ? "Instagram"
      : referrer.includes("linkedin") ? "LinkedIn"
      : referrer.includes("github") ? "GitHub"
      : referrer === "direto" ? "Direto" : "Outro";

    // 6. Save to database
    await prisma.pageView.create({
      data: {
        page: page || "/",
        country,
        city,
        device,
        browser,
        referrer: origin,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging pageview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
