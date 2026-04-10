"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, FolderKanban, TrendingUp, Eye, Activity, CalendarDays, Code2, ListTodo } from "lucide-react";
import ProjectTable from "@/components/admin/ProjectTable";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techs: string[];
  features: string[];
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  projectId: string;
  projectTitle: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectsAndLogs = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, logRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/logs")
      ]);
      
      if (projRes.ok) {
        const data = await projRes.json();
        setProjects(data);
      }
      if (logRes.ok) {
        const data = await logRes.json();
        setLogs(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsAndLogs();
  }, [fetchProjectsAndLogs]);

  // Basic Stats
  const publishedCount = projects.filter((p) => p.published).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  // Advanced Stats
  const sortedPublished = [...projects]
    .filter(p => p.published)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const lastPublishedDate = sortedPublished[0]?.createdAt 
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(sortedPublished[0].createdAt)) 
    : "Nenhum";

  const totalFeatures = projects.reduce((acc, p) => acc + (p.features?.length || 0), 0);

  const getTopTech = () => {
    if (projects.length === 0) return "N/A";
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      p.techs?.forEach(t => counts[t] = (counts[t] || 0) + 1);
    });
    if (Object.keys(counts).length === 0) return "N/A";
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };
  const topTech = getTopTech();

  // Helper for formatting relative time
  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos atrás";
    return "agora mesmo";
  };

  const getLogBadge = (action: string) => {
    switch (action) {
      case "CREATE": return <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-bold">CRIADO</span>;
      case "UPDATE": return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold">ATUALIZADO</span>;
      case "DELETE": return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold">DELETADO</span>;
      case "TOGGLE_PUBLISH": return <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-bold">STATUS</span>;
      default: return <span className="px-2 py-0.5 bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 rounded text-[10px] font-bold">{action}</span>;
    }
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase md:normal-case">Dashboard Central</h1>
          <p className="text-neutral-500 text-xs md:text-sm">Gestão de projetos e atividade recente.</p>
        </div>
        <Link
          id="new-project-btn"
          href="/admin/projects/new"
          className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
        >
          <Plus size={18} strokeWidth={2.5} /> Novo Projeto
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
        {/* Main Content (Projects Table & Stats) */}
        <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8">
          {/* Main Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: FolderKanban, label: "Total Projetos", value: projects.length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              { icon: Eye, label: "Projetos Ativos", value: publishedCount, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: TrendingUp, label: "Em Destaque", value: featuredCount, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border ${stat.bg} bg-[#0a0a0a] transition-all hover:scale-[1.02]`}>
                  <div className={`p-3 rounded-xl ${stat.bg}`}><Icon size={20} className={stat.color} /></div>
                  <div>
                    <p className="text-neutral-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-white mt-0.5">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Advanced Stats Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl w-full col-span-1">
              <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400 shrink-0"><CalendarDays size={18} /></div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase text-neutral-500 font-bold truncate">Último Lançamento</p>
                <p className="text-sm font-semibold text-white truncate">{lastPublishedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl w-full col-span-1">
              <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400 shrink-0"><Code2 size={18} /></div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase text-neutral-500 font-bold truncate">Tech Dominante</p>
                <p className="text-sm font-semibold text-white truncate">{topTech}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl w-full col-span-1">
              <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400 shrink-0"><ListTodo size={18} /></div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase text-neutral-500 font-bold truncate">Funcionalidades</p>
                <p className="text-sm font-semibold text-white truncate">{totalFeatures}</p>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2 shrink-0">
                <FolderKanban size={18} className="text-red-500" />
                Seus Projetos
              </h2>
              <span className="text-xs text-neutral-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 w-fit">
                Arraste as linhas para ordenar
              </span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ProjectTable projects={projects} onRefresh={fetchProjectsAndLogs} />
            )}
          </div>
        </div>

        {/* Sidebar (Activity Log) */}
        <div className="xl:col-span-1">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl sticky top-8 flex flex-col h-fit max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-4 md:p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-red-500" />
                Log de Atividades
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-full h-12 bg-white/5 animate-pulse rounded-lg" />)}
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center text-neutral-500 text-sm py-10">Nenhuma atividade registrada.</div>
              ) : (
                <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {logs.map((log, index) => (
                    <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
                      {/* Timeline Node */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0a0a0a] text-neutral-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-red-500/30 group-hover:text-red-400">
                        <Activity size={14} />
                      </div>
                      
                      {/* Event Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          {getLogBadge(log.action)}
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {timeSince(log.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white truncate" title={log.projectTitle}>
                          {log.projectTitle}
                        </p>
                      </div>
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
