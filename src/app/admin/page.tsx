"use client";


import Link from "next/link";
import { Plus, FolderKanban, ShieldAlert, BarChart3, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ProjectTable from "@/components/projects/ProjectTable";
import { useProjects } from "@/hooks/useProjects";
import { useAnalytics } from "@/hooks/useAnalytics";
import { APP_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/utils/date-utils";

interface BlockedAttempt {
  id: string;
  email: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { projects, loading: projectsLoading, refreshProjects } = useProjects();
  const { stats, loading: statsLoading } = useAnalytics();
  const [blockedInfo, setBlockedInfo] = useState<{ attempts: BlockedAttempt[], totalCount: number }>({ attempts: [], totalCount: 0 });
  const [blockedLoading, setBlockedLoading] = useState(true);

  useEffect(() => {
    async function fetchBlocked() {
      try {
        const res = await fetch("/api/admin/blocked-attempts");
        if (res.ok) setBlockedInfo(await res.json());
      } finally {
        setBlockedLoading(false);
      }
    }
    fetchBlocked();
  }, []);

  const isLoading = projectsLoading || statsLoading || blockedLoading;

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-neutral-500 text-sm">Resumo da atividade do seu portfólio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="/" target="_blank">
              <ExternalLink size={18} className="mr-2" /> Ver Portfólio
            </Link>
          </Button>
          <Button asChild variant="destructive">
            <Link href={APP_ROUTES.admin.projects.new}>
              <Plus size={18} className="mr-2" /> Novo Projeto
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Projetos", value: projects.length, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Tentativas Bloqueadas", value: blockedInfo.totalCount, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Visitas Totais", value: stats?.summary?.totalViews || 0, icon: BarChart3, color: "text-red-500", bg: "bg-red-500/10", href: APP_ROUTES.admin.analytics },
        ].map((stat) => (
          <div key={stat.label} className="relative group">
            {stat.href && <Link href={stat.href} className="absolute inset-0 z-10" />}
            <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center gap-5 transition-all group-hover:border-red-500/30">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban size={18} className="text-blue-500" />
                Gerenciar Projetos
              </h2>
            </div>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-32"><Loader2 className="animate-spin text-neutral-700" size={32} /></div>
            ) : (
              <ProjectTable projects={projects} onRefresh={refreshProjects} />
            )}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col shadow-2xl h-full">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" />
                Tentativas Recentes
              </h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
              {blockedInfo.attempts.length === 0 ? (
                <p className="text-neutral-500 text-sm italic text-center py-10">Nenhuma tentativa bloqueada.</p>
              ) : (
                <div className="space-y-4">
                  {blockedInfo.attempts.map((attempt) => (
                    <div key={attempt.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{attempt.email}</span>
                        <span className="text-[10px] text-neutral-500">{formatRelativeDate(attempt.createdAt)}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500">{attempt.ip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
