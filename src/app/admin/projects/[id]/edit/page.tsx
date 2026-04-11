export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/projects/ProjectForm";

export const metadata = {
  title: "Editar Projeto · Admin",
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <ProjectForm
      mode="edit"
      initialData={{
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        liveUrl: project.liveUrl ?? "",
        githubUrl: project.githubUrl ?? "",
        techs: project.techs,
        features: project.features,
        featured: project.featured,
        published: project.published,
        order: project.order,
      }}
    />
  );
}
