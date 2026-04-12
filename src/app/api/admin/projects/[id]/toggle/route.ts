import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

async function requireAdmin() {
  const session = await auth();
  const adminEmail = ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  if (!session?.user || !sessionEmail || sessionEmail !== adminEmail) return null;
  return session;
}

// PATCH /api/admin/projects/[id]/toggle — Toggles published status
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Find current value and flip it
    const current = await prisma.project.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { published: !current.published },
    });

    await prisma.activityLog.create({
      data: {
        action: "TOGGLE_PUBLISH",
        projectId: id,
        projectTitle: updated.title,
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/projects/[id]/toggle]", error);
    return NextResponse.json(
      { error: "Erro ao alternar status do projeto" },
      { status: 500 }
    );
  }
}
