"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Project } from "@/types/project";
import { TECH_ICONS } from "@/constants/techs";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className={cn(
        "flex flex-col gap-12 xl:gap-24 items-center",
        isEven ? "xl:flex-row" : "xl:flex-row-reverse"
      )}>
        {/* Lado do Conteúdo */}
        <div className="flex-[0.8] space-y-8 w-full">
          {/* Badge destaque */}
          {project.featured && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700">
               <span className="w-8 h-[1px] bg-red-500/50" />
               <span className="px-4 py-1.5 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-red-500/20 backdrop-blur-sm">
                  DESTAQUE PRINCIPAL
               </span>
            </div>
          )}

          <div className="space-y-4">
             {/* Título em vermelho */}
            <h2 className="text-[#dc2626] font-black text-2xl xl:text-4xl tracking-tighter leading-none uppercase">
              {project.title}
            </h2>
            <div className="h-1 w-20 bg-red-600/20 rounded-full" />
          </div>

          {/* Descrição */}
          <p className="text-neutral-400 text-lg leading-relaxed max-w-xl font-medium">
            {project.description}
          </p>

          {/* Features com bullet vermelho */}
          <ul className="space-y-4 pt-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-4 text-neutral-300 font-semibold group/item">
                <span className="text-[#dc2626] text-xl leading-none mt-0.5 group-hover:scale-125 transition-transform duration-300">●</span>
                <span className="text-base xl:text-lg">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Badges de techs */}
          <div className="flex flex-wrap gap-2 pt-6">
            {project.techs.map((tech) => {
              const iconUrl = TECH_ICONS[tech.toLowerCase()];
              return (
                <span 
                  key={tech} 
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:bg-neutral-800 hover:text-white hover:border-red-600/30 transition-all cursor-default backdrop-blur-md flex items-center gap-2"
                >
                  {iconUrl && (
                    <img src={iconUrl} alt={tech} className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                  )}
                  {tech}
                </span>
              );
            })}
          </div>

          {/* Botões */}
          <div className="flex flex-wrap items-center gap-6 pt-8">
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click', 'projeto', `ver_${project.title}`)}
                className="px-8 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95 shadow-[0_15px_40px_-10px_rgba(220,38,38,0.4)] border border-red-500/20 flex items-center gap-3 group"
              >
                VER PROJETO
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click', 'projeto', `github_${project.title}`)}
                className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5 transition-all active:scale-95 group hover:border-white/20"
              >
                <Github size={28} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* Lado direito — mockup */}
        <div className="flex-1 w-full group relative">
          <motion.div 
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
          >
             {/* Browser Header Mockup */}
             <div className="h-10 bg-[#121212] border-b border-white/5 flex items-center px-6 gap-2 z-20 relative">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-6 h-5 w-full max-w-[220px] bg-white/5 rounded-lg border border-white/5" />
             </div>

             <div className="relative w-full h-full overflow-hidden bg-[#050505]">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
             </div>

             {/* Inner Glow */}
             <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-3xl pointer-events-none" />
          </motion.div>

           {/* Decorative Background Glow */}
           <div className="absolute -inset-10 bg-red-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10" />
        </div>
      </div>
    </motion.section>
  );
}
