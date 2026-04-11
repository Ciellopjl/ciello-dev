import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SectionContainer from "@/components/ui/SectionContainer";
import { ArrowLeft, Github, Globe, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id, published: true }
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-black pt-28 pb-20">
      <SectionContainer>
        <Link href="/#projects" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Projetos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {format(new Date(project.createdAt), "MMMM yyyy", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  {project.techs.length} Tecnologias
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Sobre o Projeto</h2>
              <p className="text-neutral-400 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {project.features.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Principais Funcionalidades</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl text-neutral-300">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] sticky top-32 space-y-8 shadow-2xl">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Links do Projeto</h3>
                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <Button asChild variant="destructive" className="h-14 text-lg font-bold">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe size={20} className="mr-2" /> Visitar Site
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild variant="ghost" className="h-14 text-lg font-bold border border-white/10 hover:bg-white/5">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={20} className="mr-2" /> Repositório GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Tecnologias Utilizadas</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-sm font-medium text-neutral-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
