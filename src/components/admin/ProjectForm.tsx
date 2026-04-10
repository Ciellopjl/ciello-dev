"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, X, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { UploadDropzone } from "@/lib/uploadthing";

interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  techs: string[];
  features: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { id?: string };
  mode: "create" | "edit";
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  techs: [],
  features: [],
  featured: false,
  published: false,
  order: 0,
};

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({
    ...emptyForm,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);

  // --- Auto-Save Draft ---
  const DRAFT_KEY = mode === "create" ? "project_draft_new" : `project_draft_${initialData?.id}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      setHasDraft(true);
    }
  }, [DRAFT_KEY]);

  useEffect(() => {
    // Auto-save cada 30 seg
    const interval = setInterval(() => {
      if (form.title || form.description) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        setLastSaved(new Date());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [form, DRAFT_KEY]);

  function restoreDraft() {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      setForm(JSON.parse(saved));
      setHasDraft(false);
      toast.success("Rascunho restaurado!");
    }
  }

  function discardDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    toast.info("Rascunho descartado");
  }

  // --- Tag helpers ---
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  function addTag(
    field: "techs" | "features",
    input: string,
    setInput: (v: string) => void
  ) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url =
        mode === "edit"
          ? `/api/admin/projects/${initialData!.id}`
          : "/api/admin/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Erro ao salvar projeto");
      }

      toast.success(
        mode === "edit" ? "Projeto atualizado!" : "Projeto criado com sucesso!"
      );
      localStorage.removeItem(DRAFT_KEY); // clean up draft on success
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {mode === "edit" ? "Editar Projeto" : "Novo Projeto"}
          </h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            {mode === "edit"
              ? "Atualize as informações do projeto."
              : "Preencha os dados para adicionar ao portfólio."}
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: The Form (8 cols on large screens) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Draft Banners */}
          {hasDraft && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-yellow-500/90 font-medium text-center sm:text-left">Você tem um rascunho salvo localmente.</p>
              <div className="flex gap-3 shrink-0">
                <button type="button" onClick={discardDraft} className="text-xs text-neutral-400 hover:text-white transition-colors">Descartar</button>
                <button type="button" onClick={restoreDraft} className="text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 font-semibold rounded-lg transition-colors">Restaurar</button>
              </div>
            </div>
          )}
          
          {lastSaved && !hasDraft && (
            <div className="flex items-center justify-center">
              <p className="text-xs text-neutral-500 bg-neutral-900/50 px-3 py-1 rounded-full border border-white/5">
                Rascunho salvo às {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Informações Básicas
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="project-title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ex: Sistema de E-commerce"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="project-description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Descreva o projeto..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Imagens & Mídia
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Capa do Projeto <span className="text-red-500">*</span>
                </label>
                
                {form.imageUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group bg-neutral-900 shadow-2xl">
                    <img 
                      src={form.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-white text-sm font-medium">Deseja trocar de imagem?</p>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-xl scale-95 group-hover:scale-100"
                      >
                        <Trash2 size={16} /> Remover Imagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setForm((f) => ({ ...f, imageUrl: res[0].url }));
                        toast.success("Imagem enviada com sucesso!");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Erro: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-red-600 hover:bg-red-500 text-white rounded-xl px-8 transition-all hover:scale-105",
                        container: "p-8 md:p-12 min-h-[250px]",
                        allowedContent: "text-neutral-500 mt-2",
                        label: "text-neutral-300 text-lg font-semibold hover:text-red-400 transition-colors"
                      }}
                      content={{
                        label: "Arraste a capa aqui ou clique para selecionar",
                        allowedContent: "Imagens até 4MB (WebP, PNG, JPG)"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Links & Techs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Links Externos
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] items-center font-bold text-neutral-500 uppercase mb-1">Demo</label>
                    <input
                      type="url"
                      value={form.liveUrl}
                      onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">GitHub</label>
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Tecnologias
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("techs", techInput, setTechInput))}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
                    placeholder="Adicionar..."
                  />
                  <button type="button" onClick={() => addTag("techs", techInput, setTechInput)} className="p-2 bg-white/5 rounded-lg">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.techs.map(t => (
                    <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-1.5">
                      {t} <X size={10} className="cursor-pointer" onClick={() => removeTag("techs", t)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Principais Funcionalidades
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("features", featureInput, setFeatureInput))}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
                  placeholder="Ex: Auth com Google..."
                />
                <button type="button" onClick={() => addTag("features", featureInput, setFeatureInput)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {form.features.map(f => (
                  <div key={f} className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/5 rounded-xl group">
                    <span className="text-sm text-neutral-400">{f}</span>
                    <button type="button" onClick={() => removeTag("features", f)} className="p-1 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Actions for Mobile (Fixed bottom or end of form) */}
            <div className="flex items-center justify-end gap-4 pt-4 lg:hidden">
               <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl text-lg font-black hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={24} className="animate-spin" /> : mode === "edit" ? "Atualizar" : "Salvar"}
                </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Preview Sticky (5 cols on large screens) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <div className="sticky top-8 space-y-6">
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

            {/* Visibility Settings Mini Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-400">Em Destaque</span>
                  <button 
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.featured ? "bg-yellow-500" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? "translate-x-6" : ""}`} />
                  </button>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-400">Publicar Agora</span>
                  <button 
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.published ? "bg-green-500" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.published ? "translate-x-6" : ""}`} />
                  </button>
               </div>

               <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-2xl text-lg font-black hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 mt-4 h-16"
                >
                  {saving ? <Loader2 size={24} className="animate-spin" /> : mode === "edit" ? "Salvar Alterações" : "Criar Projeto"}
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
