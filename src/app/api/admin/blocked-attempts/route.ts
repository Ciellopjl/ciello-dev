import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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
    const attempts = await prisma.blockedAttempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    
    const totalCount = await prisma.blockedAttempt.count();

    return NextResponse.json({ attempts, totalCount });
  } catch (error) {
    console.error("[GET /api/admin/blocked-attempts]", error);
    return NextResponse.json({ error: "Erro ao buscar tentativas" }, { status: 500 });
  }
}
