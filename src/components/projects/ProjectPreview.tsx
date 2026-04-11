"use client";

import { Image as ImageIcon, Star } from "lucide-react";
import type { ProjectFormData } from "@/types/project";

interface ProjectPreviewProps {
  form: ProjectFormData;
}

export default function ProjectPreview({ form }: ProjectPreviewProps) {
  return (
    <div className="sticky top-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Preview do Card</h2>
      
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group">
        {/* Card Image */}
        <div className="relative w-full aspect-video bg-neutral-900 border-b border-white/5 overflow-hidden">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Card Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
              <ImageIcon size={48} strokeWidth={1} />
              <p className="text-[10px] mt-2 uppercase font-black tracking-widest opacity-50">Aguardando Imagem</p>
            </div>
          )}
          {form.featured && (
            <div className="absolute top-4 right-4 p-2 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/30">
              <Star size={16} fill="black" strokeWidth={0} />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {form.published ? (
                <span className="text-[10px] font-black uppercase tracking-wider text-green-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Publicado
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Rascunho</span>
              )}
            </div>
            <h3 className="text-xl font-black text-white leading-tight truncate">{form.title || "Título do Projeto"}</h3>
            <p className="text-neutral-400 text-sm mt-2 line-clamp-3 leading-relaxed">
              {form.description || "A descrição aparecerá aqui. Adicione detalhes impactantes no formulário ao lado."}
            </p>
          </div>

          {/* Techs Preview */}
          <div className="flex flex-wrap gap-2">
            {(form.techs.length > 0 ? form.techs.slice(0, 4) : ["Tech A", "Tech B"]).map((t, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-neutral-400">
                {t}
              </span>
            ))}
          </div>

          {/* Footer Buttons Preview */}
          <div className="pt-4 flex gap-3">
            <div className="flex-1 h-10 bg-neutral-800 rounded-xl animate-pulse" />
            <div className="w-10 h-10 bg-neutral-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
