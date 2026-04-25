"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ProjectFormData } from "@/types/project";
import ProjectPreview from "./ProjectPreview";
import ProjectFormFields from "./ProjectFormFields";
import { Button } from "@/components/ui/button";

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { id?: string };
  mode: "create" | "edit";
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
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
  const [form, setForm] = useState<ProjectFormData>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);

  const DRAFT_KEY = mode === "create" ? "project_draft_new" : `project_draft_${initialData?.id}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setHasDraft(true);
  }, [DRAFT_KEY]);

  // Garantir que o scroll da página não fique "preso" por engano
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  // Otimização: Salva rascunho apenas se o usuário parar de digitar/mexer por 2 segundos (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasContent = form.title.trim() || form.description.trim() || form.imageUrl;
      if (hasContent) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, DRAFT_KEY]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error("O título do projeto é obrigatório.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("A descrição do projeto é obrigatória.");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Faça o upload de uma imagem de capa antes de salvar.");
      return;
    }

    setSaving(true);
    try {
      const url = mode === "edit" ? `/api/admin/projects/${initialData!.id}` : "/api/admin/projects";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar projeto");
      toast.success(mode === "edit" ? "Projeto atualizado!" : "Projeto criado!");
      localStorage.removeItem(DRAFT_KEY);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {mode === "edit" ? "Editar Projeto" : "Novo Projeto"}
          </h1>
        </div>
      </div>
 
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-6 order-1 xl:order-none">
          {hasDraft && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <p className="text-sm font-bold text-yellow-500">Rascunho disponível</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-neutral-400 hover:text-white"
                  onClick={() => {
                    localStorage.removeItem(DRAFT_KEY);
                    setHasDraft(false);
                    toast.info("Rascunho descartado");
                  }}
                >
                  Descartar
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem(DRAFT_KEY);
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        setForm(parsed);
                        localStorage.removeItem(DRAFT_KEY);
                        setHasDraft(false);
                        toast.success("Rascunho restaurado!");
                      }
                    } catch (e) {
                      localStorage.removeItem(DRAFT_KEY);
                      setHasDraft(false);
                    }
                  }}
                >
                  Restaurar
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-6">
            <ProjectFormFields form={form || emptyForm} setForm={setForm} />
            <Button onClick={handleSubmit} disabled={saving} variant="destructive" className="w-full xl:hidden h-16 text-lg">
              {saving ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
            </Button>
          </div>
        </div>
        <div className="xl:col-span-7 order-2 xl:order-none relative">
          <div className="xl:sticky xl:top-8 space-y-6 pb-10">
            <ProjectPreview form={form || emptyForm} />
            <Button 
              type="button"
              onClick={handleSubmit} 
              disabled={saving} 
              variant="destructive" 
              className="w-full h-16 text-lg transition-all active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)]"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : mode === "edit" ? "Atualizar Projeto" : "Criar Projeto"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
