import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const headersList = await headers();
    
    // Extract IP (might be in x-forwarded-for behind proxy)
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";

    if (!email) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    // Gravar a tentativa bloqueada no banco
    const attempt = await prisma.blockedAttempt.create({
      data: {
        email,
        ip,
        userAgent,
      },
    });

    console.warn(`[SECURITY] Tentativa bloqueada registrada: ${email} de ${ip}`);

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/blocked]", error);
    return NextResponse.json(
      { error: "Erro ao registrar tentativa" },
      { status: 500 }
    );
  }
}
