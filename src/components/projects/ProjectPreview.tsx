"use client";

import { Image as ImageIcon, ExternalLink, Github } from "lucide-react";
import type { ProjectFormData } from "@/types/project";
import { TECH_ICONS, getTechIcon } from "@/constants/techs";
import { cn } from "@/lib/utils";

interface ProjectPreviewProps {
  form: ProjectFormData;
}

export default function ProjectPreview({ form }: ProjectPreviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Preview Real do Layout</h2>
      
      <div className="glass-premium rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full bg-[#050505]">
        <div className="flex flex-col xl:flex-row min-h-[400px] lg:min-h-[500px]">
          {/* Left: Content */}
          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center flex-[1.1] space-y-6 lg:space-y-8">
            {form.featured && (
               <div className="flex items-center gap-3 mb-2 animate-pulse">
                 <span className="px-4 py-1.5 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                   DESTAQUE PRINCIPAL
                 </span>
               </div>
            )}

            <div className="space-y-4">
              <h3 className="text-3xl lg:text-4xl font-black text-[#dc2626] tracking-tighter leading-[0.9] uppercase">
                {form.title || "Título do Projeto"}
              </h3>
              <div className="h-1.5 w-16 bg-red-600/30 rounded-full" />
            </div>

            <p className="text-neutral-400 text-sm lg:text-base leading-relaxed line-clamp-4 font-medium">
              {form.description || "A descrição aparecerá aqui. Adicione detalhes impactantes no formulário ao lado."}
            </p>

            {/* Features Preview */}
            <ul className="space-y-3 py-4">
              {(form.features.length > 0 ? form.features.slice(0, 4) : ["Funcionalidade 1", "Funcionalidade 2", "Funcionalidade 3"]).map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-xs lg:text-sm text-neutral-300 font-bold">
                  <span className="text-[#dc2626] text-lg leading-none mt-0.5">●</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Techs Preview */}
            <div className="flex flex-wrap gap-2 pt-4">
              {form.techs.map((t, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2.5 hover:bg-white/10 transition-all cursor-default">
                  <img 
                    src={getTechIcon(t)} 
                    alt={t} 
                    className="w-4 h-4 object-contain opacity-70" 
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {t}
                </span>
              ))}
              {form.techs.length === 0 && (
                ["React", "Next.js", "TypeScript"].map((t, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2 opacity-30">
                    <img 
                      src={getTechIcon(t)} 
                      alt={t} 
                      className="w-4 h-4 object-contain opacity-20 grayscale" 
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    {t}
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 pt-8">
              <div className="px-8 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-red-600/30">
                Ver Projeto <ExternalLink size={16} />
              </div>
              <div className="w-12 h-12 border border-white/10 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500">
                <Github size={20} />
              </div>
            </div>
          </div>

          {/* Right: Image Preview with Mockup */}
          <div className="relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden flex-1 border-t lg:border-t-0 lg:border-l border-white/10 min-h-[300px] lg:min-h-[350px] p-6 lg:p-0">
             {/* Simple Browser Mockup for Preview */}
             <div className="w-full lg:w-[92%] aspect-video rounded-xl lg:rounded-2xl overflow-hidden border border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] bg-[#050505] flex flex-col scale-100 lg:scale-110">
                <div className="h-8 bg-[#121212] border-b border-white/10 flex items-center px-4 gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                   <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                   <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                </div>
                 <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
                    {form.videoUrl ? (
                      <video 
                        src={form.videoUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                      />
                    ) : form.imageUrl ? (
                      <img src={form.imageUrl} alt="Card Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-700">
                        <ImageIcon size={32} strokeWidth={1} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Aguardando Mídia</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                 </div>
             </div>
             
             {/* Background Glow */}
             <div className="absolute -inset-10 bg-red-600/5 blur-[50px] rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
