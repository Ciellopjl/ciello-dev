"use client";

import { useState } from "react";
import { Plus, X, Trash2, Sparkles, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ProjectFormData } from "@/types/project";
import { TECH_ICONS, getTechIcon } from "@/constants/techs";

interface ProjectFormFieldsProps {
  form: ProjectFormData;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormData>>;
}

export default function ProjectFormFields({ form, setForm }: ProjectFormFieldsProps) {
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleRefineAI() {
    if (form.features.length === 0) {
      toast.error("Adicione algumas funcionalidades primeiro para eu organizar!");
      return;
    }

    setIsGenerating(true);
    const promise = fetch("/api/admin/ai/generate-suggestions", {
      method: "POST",
      body: JSON.stringify({ 
        title: form.title, 
        description: form.description, 
        currentFeatures: form.features,
        type: "refine" 
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Erro na IA");
      const data = await res.json();
      
      setForm(f => ({
        ...f,
        features: data.features || f.features
      }));

      return data;
    });

    toast.promise(promise, {
      loading: "Organizando funcionalidades...",
      success: "Funcionalidades organizadas!",
      error: "Falha ao organizar.",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [techPaste, setTechPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  async function handleSuggestAI(manualText?: string) {
    const githubUrl = form.githubUrl?.trim();
    
    if (!githubUrl && !manualText) {
      toast.error("Insira um link do GitHub ou cole um texto para eu analisar!");
      return;
    }

    setIsSuggesting(true);
    const promise = fetch("/api/admin/ai/generate-suggestions", {
      method: "POST",
      body: JSON.stringify({ 
        title: form.title, 
        description: form.description, 
        githubUrl: githubUrl,
        pastedText: manualText,
        type: "suggest" 
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Erro na IA");
      const data = await res.json();
      
      if (data.techs) {
        setForm(f => ({
          ...f,
          techs: Array.from(new Set([...f.techs, ...data.techs])),
          features: f.features.length === 0 ? data.features : f.features
        }));
        setTechPaste("");
        setShowPaste(false);
      }

      return data;
    });

    toast.promise(promise, {
      loading: "Analisando informações...",
      success: "Sugestões aplicadas!",
      error: "Falha ao analisar.",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  }

  function addTag(field: "techs" | "features", input: string, setInput: (v: string) => void) {
    const value = input.trim();
    if (!value) return;
    if (!form[field].includes(value)) {
      setForm((f) => ({ ...f, [field]: [...f[field], value] }));
    }
    setInput("");
  }

  function removeTag(field: "techs" | "features", value: string) {
    setForm((f) => ({ ...f, [field]: f[field].filter((t) => t !== value) }));
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Informações Básicas
        </h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Título</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Plataforma de E-commerce"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Descrição</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descreva o projeto (principais desafios e soluções)..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 resize-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 space-y-8">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Imagens & Mídia
        </h2>
        
        {/* Imagem de Capa */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1 opacity-70">Imagem de Capa (Obrigatória)</label>
          {form.imageUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group bg-black/40">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all">
                  <Trash2 size={16} /> Remover Capa
                </button>
              </div>
            </div>
          ) : (
            <CldUploadWidget 
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => {
                if (result.info && typeof result.info === "object") {
                  setForm((f) => ({ ...f, imageUrl: result.info.secure_url }));
                  toast.success("Imagem enviada!");
                }
              }}
              options={{ maxFiles: 1, resourceType: "image" }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-red-500/50 hover:bg-white/[0.02] transition-all group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-neutral-500 group-hover:text-red-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Upload da Capa</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Clique para selecionar</p>
                  </div>
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        {/* Vídeo do Projeto */}
        <div className="space-y-4 pt-8 border-t border-white/5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1 opacity-70">Vídeo de Demonstração (Opcional)</label>
          
          <div className="space-y-4">
            <input
              type="url"
              value={form.videoUrl || ""}
              onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
              placeholder="Cole o link do vídeo (MP4 direto)..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all font-medium"
            />
            
            {form.videoUrl ? (
               <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black group">
                 <video 
                   src={form.videoUrl} 
                   className="w-full h-full object-contain" 
                   autoPlay 
                   muted 
                   loop 
                   playsInline 
                 />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setForm((f) => ({ ...f, videoUrl: "" }))}
                      className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
                    >
                      <Trash2 size={16} /> Remover Vídeo
                    </button>
                 </div>
               </div>
            ) : (
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  if (result.info && typeof result.info === "object") {
                    setForm((f) => ({ ...f, videoUrl: result.info.secure_url }));
                    toast.success("Vídeo enviado!");
                  }
                }}
                onError={(err) => {
                   console.error("Cloudinary Error:", err);
                   toast.error("Erro no upload do vídeo.");
                }}
                options={{
                  maxFiles: 1,
                  resourceType: "auto",
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-red-500/50 hover:bg-white/[0.02] transition-all group"
                  >
                    <Plus size={20} className="text-neutral-500 group-hover:text-red-500" />
                    <p className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">Fazer upload de um vídeo</p>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Links & Acessos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">GitHub URL</label>
            <input
              type="url"
              value={form.githubUrl || ""}
              onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
              placeholder="https://github.com/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Live Demo URL</label>
            <input
              type="url"
              value={form.liveUrl || ""}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              placeholder="https://projeto.com..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Techs & Features - Simplified for brevity in Fields component */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
               <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 shrink-0">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Tecnologias
               </h2>
               <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                 <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPaste(!showPaste)}
                  className="h-7 px-3 text-[9px] gap-1.5 border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
                 >
                   Colar em Massa
                 </Button>
                 <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSuggestAI()}
                  disabled={isSuggesting}
                  className="h-7 px-3 text-[9px] gap-1.5 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all whitespace-nowrap"
                 >
                   {isSuggesting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                   Sugerir do GitHub
                 </Button>
               </div>
            </div>

            {showPaste && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <textarea 
                  value={techPaste}
                  onChange={(e) => setTechPaste(e.target.value)}
                  placeholder="Cole aqui o texto do README ou uma lista de tecnologias..."
                  className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-red-500/50 resize-none transition-all"
                />
                <Button 
                  type="button"
                  onClick={() => handleSuggestAI(techPaste)}
                  disabled={isSuggesting || !techPaste.trim()}
                  className="w-full h-8 text-[10px] font-bold bg-red-600 hover:bg-red-700"
                >
                  Extrair Tecnologias com IA
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("techs", techInput, setTechInput))} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm" placeholder="Adicionar..." />
              <button type="button" onClick={() => addTag("techs", techInput, setTechInput)} className="p-2 bg-white/5 rounded-lg"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.techs.map(t => (
                <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-1.5 animate-in zoom-in duration-300 group">
                  <img 
                    src={getTechIcon(t)} 
                    alt={t} 
                    className="w-3 h-3 object-contain opacity-70 group-hover:opacity-100 transition-opacity" 
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {t} 
                  <X size={10} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeTag("techs", t)} />
                </span>
              ))}
            </div>
         </div>
         {/* Features */}
         <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
               <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Funcionalidades
               </h2>
               <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleRefineAI}
                disabled={isGenerating}
                className="h-7 text-[9px] gap-1.5 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
               >
                 {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                 Organizar com IA
               </Button>
            </div>
            <div className="flex gap-2">
              <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("features", featureInput, setFeatureInput))} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm" placeholder="Adicionar..." />
              <button type="button" onClick={() => addTag("features", featureInput, setFeatureInput)} className="p-2 bg-white/5 rounded-lg"><Plus size={16} /></button>
            </div>
            <div className="space-y-1">
              {form.features.map(f => (
                <div key={f} className="flex justify-between text-xs text-neutral-400 p-1 border-b border-white/5">
                  {f} <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeTag("features", f)} />
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
