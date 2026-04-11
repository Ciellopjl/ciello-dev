import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

// ─── Auth Guard ──────────────────────────────────────────────────────────────
async function checkAuth() {
  const session = await auth();
  if (!session || session.user?.email !== ADMIN_EMAIL) return null;
  return session;
}

// PUT /api/admin/projects/reorder — Receives { items: { id: string, order: number }[] }
export async function PUT(request: Request) {
  const session = await checkAuth();
  if (!session) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    // Usamos transações do Prisma para atualizar todas as ordens de uma vez
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ message: "Ordem atualizada com sucesso!" });
  } catch (error) {
    console.error("[PUT /api/admin/projects/reorder]", error);
    return NextResponse.json(
      { error: "Erro ao reordenar projetos" },
      { status: 500 }
    );
  }
}
