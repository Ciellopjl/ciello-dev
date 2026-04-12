import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Basic Counts
    const [totalViews, viewsToday, totalClicks, clicksToday] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.linkClick.count(),
      prisma.linkClick.count({ where: { createdAt: { gte: startOfToday } } }),
    ]);

    // Device distribution
    const devices = await prisma.pageView.groupBy({
      by: ['device'],
      _count: true,
    });

    // Recent activity
    const recentViews = await prisma.pageView.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        page: true,
        device: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      summary: {
        totalViews,
        viewsToday,
        totalClicks,
        clicksToday,
      },
      devices: devices.map(d => ({ 
        name: d.device === 'mobile' ? 'Mobile' : d.device === 'tablet' ? 'Tablet' : 'Desktop', 
        value: d._count 
      })),
      recentViews
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
