import SectionContainer from "./SectionContainer";
import ProjectCard from "./ProjectCard";
import { prisma } from "@/lib/prisma";

export default async function Projects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <SectionContainer id="projects" className="max-w-7xl">
      <div className="text-center mb-16 px-4">
        <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-4">
          Projetos
        </h2>
        <h3 className="text-4xl font-bold tracking-tight">Soluções reais para <br /> <span className="text-muted-foreground">desafios complexos.</span></h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={{
            id: project.id,
            name: project.title,
            description: project.description,
            highlights: project.features,
            tech: project.techs,
            link: project.liveUrl ?? "#",
            github: project.githubUrl ?? "#",
            image: project.imageUrl,
            featured: project.featured
          }} />
        ))}
        {projects.length === 0 && (
          <p className="text-neutral-500 text-center col-span-1 lg:col-span-2 py-10">
            Nenhum projeto publicado no momento.
          </p>
        )}
      </div>
    </SectionContainer>
  );
}
