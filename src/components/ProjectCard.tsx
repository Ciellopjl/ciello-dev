"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    highlights: string[];
    tech: string[];
    link: string;
    github: string;
    image: string;
    featured?: boolean;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative glass-premium rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 hover:glow-red",
        project.featured ? "lg:col-span-2" : "col-span-1"
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] h-full">
        {/* Project Content */}
        <div className="p-8 md:p-12 flex flex-col">
          {project.featured && (
            <span className="inline-block mb-4 px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest rounded-full">
              Destaque Principal
            </span>
          )}
          <h3 className="text-3xl font-black mb-4 group-hover:text-red-500 transition-colors tracking-tight">
            {project.name}
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            {project.description}
          </p>

          <div className="space-y-3 mb-8 flex-grow">
             {project.highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

           <div className="flex flex-wrap gap-2 mb-10">
            {project.tech.map((t) => (
              <span key={t} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold border border-white/10 text-neutral-300 group-hover:border-red-500/30 transition-colors">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
            >
              <ExternalLink size={18} />
              Ver Projeto
            </a>
             <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105 active:scale-95 text-neutral-400 hover:text-white"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Project Image Preview */}
        <div className="relative bg-[#050505] p-0 flex items-center justify-center min-h-[500px] lg:min-h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 vignette-overlay pointer-events-none z-10" />
          
          <motion.div 
            whileHover={{ y: -20, scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full h-full flex items-center justify-center z-20 p-8 lg:p-12"
          >
             <div className="mockup-glow" />
             <div className="relative rounded-2xl overflow-hidden glass border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-red-500/50 group-hover:shadow-[0_0_100px_rgba(239,68,68,0.2)]">
               <img
                  src={project.image}
                  alt={project.name}
                  className={cn(
                    "w-auto h-auto transition-all duration-700 group-hover:scale-115",
                    "max-h-[450px] md:max-h-[650px] lg:max-h-[850px] object-contain",
                    "opacity-95 group-hover:opacity-100 drop-shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
                  )}
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
