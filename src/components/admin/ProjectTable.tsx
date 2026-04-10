"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Eye, EyeOff, Plus, GripVertical, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techs: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  order: number;
}

interface ProjectTableProps {
  projects: Project[];
  onRefresh: () => void;
}

function SortableRow({ project, onToggle, onDeleteRaw, loadingId }: { project: Project, onToggle: (id: string) => void, onDeleteRaw: (id: string, title: string) => void, loadingId: string | null }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <tr ref={setNodeRef} style={style} className={`transition-colors group relative ${isDragging ? "bg-white/10 shadow-2xl" : "hover:bg-white/2"}`}>
        {/* Grab Handler */}
        <td className="py-4 pl-4 pr-2">
          <button {...attributes} {...listeners} className="text-neutral-600 hover:text-white cursor-grab active:cursor-grabbing transition-colors">
            <GripVertical size={18} />
          </button>
        </td>
        
        {/* Title & Preview Tooltip */}
        <td className="py-4 px-4">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="font-semibold text-white cursor-help border-b border-dashed border-white/20 pb-0.5">{project.title}</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content 
                side="top" 
                align="center"
                className="z-50 bg-neutral-900 border border-white/10 p-3 rounded-xl shadow-2xl w-64 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.imageUrl || "https://placehold.co/600x400/111/444.png?text=Sem+Capa"} alt="Cover" className="w-full h-32 object-cover rounded-lg mb-2 bg-neutral-800" />
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{project.description}</p>
                <Tooltip.Arrow className="fill-neutral-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </td>

        {/* Techs */}
        <td className="py-4 px-4">
          <div className="flex flex-wrap gap-1">
            {project.techs.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-400">
                {tech}
              </span>
            ))}
            {project.techs.length > 3 && (
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-500">
                +{project.techs.length - 3}
              </span>
            )}
          </div>
        </td>

        {/* Featured */}
        <td className="py-4 px-4 text-center">
          {project.featured ? (
            <Star size={16} className="text-yellow-500 mx-auto" fill="currentColor" />
          ) : (
            <Star size={16} className="text-neutral-700 mx-auto" />
          )}
        </td>

        {/* Published */}
        <td className="py-4 px-4 text-center">
          <button
            onClick={() => onToggle(project.id)}
            disabled={loadingId === project.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              project.published
                ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                : "bg-neutral-700/30 text-neutral-400 border border-white/10 hover:bg-white/10"
            } ${loadingId === project.id ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {project.published ? <Eye size={12} /> : <EyeOff size={12} />}
            {project.published ? "Publicado" : "Rascunho"}
          </button>
        </td>

        {/* Actions */}
        <td className="py-4 px-4">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Editar"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => onDeleteRaw(project.id, project.title)}
              disabled={loadingId === project.id}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
              title="Deletar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    </Tooltip.Provider>
  );
}

export default function ProjectTable({ projects: initialProjects, onRefresh }: ProjectTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // DND state
  const [items, setItems] = useState<Project[]>(initialProjects || []);
  
  // Sync state when props change
  useEffect(() => {
    setItems(initialProjects);
  }, [initialProjects]);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleToggle(id: string) {
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
  }

  function requestDelete(id: string, title: string) {
    setProjectToDelete({ id, title });
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!projectToDelete) return;
    setIsDeleteModalOpen(false);
    setLoadingId(projectToDelete.id);
    
    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(`"${projectToDelete.title}" deletado com sucesso.`);
      onRefresh();
    } catch {
      toast.error("Erro ao deletar projeto.");
    } finally {
      setLoadingId(null);
      setProjectToDelete(null);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      
      // Save order quietly to API
      const reorderPayload = newArray.map((proj, idx) => ({ id: proj.id, order: idx }));
      fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderPayload })
      }).then((res) => {
        if (!res.ok) toast.error("Falha ao salvar nova ordem.");
        else {
           // We don't need a heavy reload toast for everything.
           onRefresh(); 
        }
      });
      
      return newArray;
    });
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <p className="text-lg mb-4">Nenhum projeto cadastrado ainda.</p>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-all">
          <Plus size={16} /> Criar primeiro projeto
        </Link>
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
                <th className="pb-3 px-4 text-neutral-500 font-medium">Techs</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-center">Destaque</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-center">Publicado</th>
                <th className="pb-3 px-4 text-neutral-500 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((project) => (
                  <SortableRow 
                    key={project.id} 
                    project={project} 
                    onToggle={handleToggle} 
                    onDeleteRaw={requestDelete} 
                    loadingId={loadingId} 
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Delete Modal */ }
      <AnimatePresence>
        {isDeleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Excluir Projeto</h2>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                Tem certeza que deseja excluir <span className="font-semibold text-white">"{projectToDelete.title}"</span>? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
