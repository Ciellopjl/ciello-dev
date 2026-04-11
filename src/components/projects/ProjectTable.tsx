"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from "sonner";

import type { Project } from "@/types/project";
import SortableProjectRow from "./SortableProjectRow";
import ProjectDeleteModal from "./ProjectDeleteModal";
import { Button } from "@/components/ui/button";

interface ProjectTableProps {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectTable({ projects: initialProjects, onRefresh }: ProjectTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [items, setItems] = useState<Project[]>(initialProjects || []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    setItems(initialProjects);
  }, [initialProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      toast.success("Status atualizado!");
      onRefresh();
    } catch {
      toast.error("Erro ao atualizar status.");
    } finally {
      setLoadingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleteModalOpen(false);
    setLoadingId(projectToDelete.id);
    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Projeto excluído!");
      onRefresh();
    } catch {
      toast.error("Erro ao deletar projeto.");
    } finally {
      setLoadingId(null);
      setProjectToDelete(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      
      const reorderPayload = newArray.map((proj, idx) => ({ id: proj.id, order: idx }));
      fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderPayload })
      }).then((res) => {
        if (!res.ok) toast.error("Falha ao salvar ordem.");
        else onRefresh();
      });
      
      return newArray;
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <p className="text-lg mb-4">Nenhum projeto cadastrado.</p>
        <Button asChild variant="destructive">
          <Link href="/admin/projects/new"><Plus size={16} /> Criar Projeto</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="pb-3 pl-4 pr-2 w-10"></th>
                <th className="pb-3 px-4 text-neutral-500 font-medium">Título</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-right md:text-left">Techs</th>
                <th className="hidden md:table-cell pb-3 px-4 text-neutral-500 font-medium text-center">Destaque</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-center">Status</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((project) => (
                  <SortableProjectRow 
                    key={project.id} 
                    project={project} 
                    onToggle={handleToggle} 
                    onDeleteRequest={(id, title) => { setProjectToDelete({ id, title }); setIsDeleteModalOpen(true); }} 
                    loadingId={loadingId} 
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      <ProjectDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
        projectTitle={projectToDelete?.title || ""} 
      />
    </>
  );
}
