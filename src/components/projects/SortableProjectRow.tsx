"use client";

import Link from "next/link";
import { Pencil, Trash2, Star, Eye, EyeOff, GripVertical } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { Project } from "@/types/project";

interface SortableProjectRowProps {
  project: Project;
  onToggle: (id: string) => void;
  onDeleteRequest: (id: string, title: string) => void;
  loadingId: string | null;
}

export default function SortableProjectRow({ 
  project, 
  onToggle, 
  onDeleteRequest, 
  loadingId 
}: SortableProjectRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <tr ref={setNodeRef} style={style} className={`transition-colors group relative ${isDragging ? "bg-white/10 shadow-2xl" : "hover:bg-white/[0.02]"}`}>
        <td className="py-4 pl-4 pr-2">
          <button {...attributes} {...listeners} className="text-neutral-600 hover:text-white cursor-grab active:cursor-grabbing transition-colors">
            <GripVertical size={18} />
          </button>
        </td>
        
        <td className="py-4 px-4 whitespace-nowrap">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="font-semibold text-white cursor-help border-b border-dashed border-white/20 pb-0.5">{project.title}</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content 
                side="top" 
                align="center"
                className="z-50 bg-neutral-900 border border-white/10 p-3 rounded-xl shadow-2xl w-64 animate-in fade-in zoom-in-95"
              >
                <img src={project.imageUrl || "https://placehold.co/600x400/111/444.png?text=Sem+Capa"} alt="Cover" className="w-full h-32 object-cover rounded-lg mb-2 bg-neutral-800" />
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed whitespace-normal">{project.description}</p>
                <Tooltip.Arrow className="fill-neutral-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </td>

        <td className="py-4 px-4 min-w-[200px]">
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

        <td className="py-4 px-4 text-center">
          {project.featured ? (
            <Star size={16} className="text-yellow-500 mx-auto" fill="currentColor" />
          ) : (
            <Star size={16} className="text-neutral-700 mx-auto" />
          )}
        </td>

        <td className="py-4 px-4 text-center whitespace-nowrap">
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

        <td className="py-4 px-4 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => onDeleteRequest(project.id, project.title)}
              disabled={loadingId === project.id}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    </Tooltip.Provider>
  );
}
