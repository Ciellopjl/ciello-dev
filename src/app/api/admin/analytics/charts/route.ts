import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

    // 1. Visits over time (last 30 days)
    const views = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    });

    // Group by date in JS
    const visitsByDay = new Map();
    // Initialize map with all 30 days
    for (let i = 0; i <= 30; i++) {
      const dateStr = format(subDays(new Date(), i), 'dd/MM');
      visitsByDay.set(dateStr, 0);
    }

    views.forEach((view) => {
      const dateStr = format(view.createdAt, 'dd/MM');
      if (visitsByDay.has(dateStr)) {
        visitsByDay.set(dateStr, visitsByDay.get(dateStr) + 1);
      }
    });

    const visitsData = Array.from(visitsByDay.entries())
      .map(([date, count]) => ({ date, visits: count }))
      .reverse();

    // 2. Clicks by link
    const clicks = await prisma.linkClick.groupBy({
      by: ['link'],
      _count: {
        link: true
      },
      orderBy: {
        _count: {
          link: 'desc'
        }
      },
      take: 10,
    });

    const clicksData = clicks.map(c => ({
      name: c.link,
      clicks: c._count
    }));

    return NextResponse.json({
      visits: visitsData,
      clicks: clicksData
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
