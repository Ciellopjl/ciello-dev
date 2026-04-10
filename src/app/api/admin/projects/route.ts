import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

// ─── Auth Guard Helper ────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.email !== ADMIN_EMAIL) {
    return null;
  }
  return session;
}

// GET /api/admin/projects — Lists ALL projects (published + drafts)
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[GET /api/admin/projects]", error);
    return NextResponse.json(
      { error: "Erro ao buscar projetos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects — Creates a new project
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, features, techs, liveUrl, githubUrl, imageUrl, featured, published, order } = body;

    // Basic validation
    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Título, descrição e imagem são obrigatórios" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
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
        action: "CREATE",
        projectId: project.id,
        projectTitle: project.title,
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/projects]", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
