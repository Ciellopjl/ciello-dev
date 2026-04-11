import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { Project } from "@/types/project";
import { APP_ROUTES } from "@/constants/routes";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(APP_ROUTES.api.admin.projects);
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePublication = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      toast.success("Status atualizado!");
      fetchProjects();
      return true;
    } catch {
      toast.error("Erro ao atualizar status.");
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Projeto excluído!");
      fetchProjects();
      return true;
    } catch {
      toast.error("Erro ao excluir projeto.");
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    refreshProjects: fetchProjects,
    togglePublication,
    deleteProject,
  };
}
