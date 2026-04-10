import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.email !== ADMIN_EMAIL) return null;
  return session;
}

// PUT /api/admin/projects/[id] — Full update of a project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, features, techs, liveUrl, githubUrl, imageUrl, featured, published, order } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        features: features ?? [],
        techs: techs ?? [],
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        imageUrl,
        featured: featured ?? false,
        published: published ?? false,
        order: order ?? 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        projectId: project.id,
        projectTitle: project.title,
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PUT /api/admin/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects/[id] — Removes a project permanently
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Pegar o projeto antes de deletar para log
    const projectToRemove = await prisma.project.findUnique({ where: { id } });
    
    await prisma.project.delete({ where: { id } });
    
    if (projectToRemove) {
      await prisma.activityLog.create({
        data: {
          action: "DELETE",
          projectId: id,
          projectTitle: projectToRemove.title,
        }
      });
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    console.error("[DELETE /api/admin/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}
