import SectionContainer from "@/components/ui/SectionContainer";
import ProjectCard from "@/components/projects/ProjectCard";
import { prisma } from "@/lib/prisma";

export default async function Projects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" }
    ],
  });

  return (
    <SectionContainer id="projects" className="max-w-7xl">
      <div className="text-center mb-16 px-4">
        <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-4">
          Projetos
        </h2>
        <h3 className="text-4xl font-bold tracking-tight">Soluções reais para <br /> <span className="text-muted-foreground">desafios complexos.</span></h3>
      </div>

      <div className="flex flex-col gap-24 lg:gap-40 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            index={index}
            project={project} 
          />
        ))}
        {projects.length === 0 && (
          <p className="text-neutral-500 text-center py-10">
            Nenhum projeto publicado no momento.
          </p>
        )}
      </div>
    </SectionContainer>
  );
}
