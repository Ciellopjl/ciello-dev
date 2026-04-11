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

  useEffect(() => {
    const interval = setInterval(() => {
      if (form.title || form.description) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        setLastSaved(new Date());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [form, DRAFT_KEY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {hasDraft && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-between">
              <p className="text-sm text-yellow-500">Rascunho disponível</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => localStorage.removeItem(DRAFT_KEY)}>Descartar</Button>
                <Button variant="secondary" size="sm" onClick={() => setForm(JSON.parse(localStorage.getItem(DRAFT_KEY)!))}>Restaurar</Button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProjectFormFields form={form} setForm={setForm} />
            <Button type="submit" disabled={saving} variant="destructive" className="w-full lg:hidden h-16 text-lg">
              {saving ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
            </Button>
          </form>
        </div>
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-6">
          <ProjectPreview form={form} />
          <Button onClick={handleSubmit} disabled={saving} variant="destructive" className="w-full h-16 text-lg">
            {saving ? <Loader2 className="animate-spin" /> : mode === "edit" ? "Atualizar Projeto" : "Criar Projeto"}
          </Button>
        </div>
      </div>
    </div>
  );
}
