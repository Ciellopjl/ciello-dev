import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  if (!session || !sessionEmail || sessionEmail !== adminEmail) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 });
  }
}
