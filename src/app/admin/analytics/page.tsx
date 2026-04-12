import { prisma } from "@/lib/prisma";
import { 
  Users, 
  MousePointer2, 
  Globe, 
  Smartphone, 
  ArrowUpRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { format, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import VisitsChart from "@/components/analytics/VisitsChart";
import DevicesChart from "@/components/analytics/DevicesChart";
import ClicksChart from "@/components/analytics/ClicksChart";


export default async function AnalyticsPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const thirtyDaysAgo = startOfDay(subDays(now, 30));

  const [
    totalViews,
    viewsToday,
    totalClicks,
    clicksToday,
    recentViews,
    deviceGroups,
    clickGroups,
    viewsByDay
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.linkClick.count(),
    prisma.linkClick.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      _count: { _all: true }
    }),
    prisma.linkClick.groupBy({
      by: ["link"],
      _count: { _all: true },
      orderBy: { _count: { link: "desc" } },
      take: 7
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  // Process data for charts
  const visitsMap = new Map();
  // Initialize last 30 days with 0
  for (let i = 0; i <= 30; i++) {
    const dateStr = format(subDays(new Date(), i), "dd/MM");
    visitsMap.set(dateStr, 0);
  }

  viewsByDay.forEach((curr) => {
    const date = format(curr.createdAt, "dd/MM");
    if (visitsMap.has(date)) {
      visitsMap.set(date, visitsMap.get(date) + 1);
    }
  });

  const viewsChartData = Array.from(visitsMap.entries())
    .map(([name, value]) => ({ name, value }))
    .reverse();

  const deviceChartData = deviceGroups.map(g => ({
    name: g.device === 'mobile' ? 'Mobile' : g.device === 'tablet' ? 'Tablet' : 'Desktop',
    value: g._count._all
  }));

  const linkChartData = clickGroups.map(g => ({
    name: g.link,
    value: g._count._all
  }));

  const stats = [
    { label: "Total de Visitas", value: totalViews, icon: Users, color: "text-blue-500" },
    { label: "Visitas Hoje", value: viewsToday, icon: TrendingUp, color: "text-red-500" },
    { label: "Cliques Totais", value: totalClicks, icon: MousePointer2, color: "text-emerald-500" },
    { label: "Cliques Hoje", value: clicksToday, icon: ArrowUpRight, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Analytics</h1>
        <p className="text-neutral-500">Acompanhe o desempenho e alcance do seu portfólio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-[#0a0a0a] rounded-2xl border border-white/5 flex flex-col gap-4 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} border border-white/5`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl font-black mt-1 text-white tabular-nums">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl shadow-black/40">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
            <TrendingUp size={18} className="text-red-500" />
            Visitas nos últimos 30 dias
          </h3>
          <div className="h-[350px] w-full">
            <VisitsChart data={viewsChartData} />
          </div>
        </div>

        <div className="p-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/40">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
            <Smartphone size={18} className="text-blue-500" />
            Dispositivos
          </h3>
          <div className="h-[350px] w-full">
            <DevicesChart data={deviceChartData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="p-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/40">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
            <MousePointer2 size={18} className="text-emerald-500" />
            Cliques por Link
          </h3>
          <div className="h-[350px] w-full">
            <ClicksChart data={linkChartData} />
          </div>
        </div>

        <div className="p-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl shadow-black/40">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
            <Clock size={18} className="text-amber-500" />
            Acessos Recentes
          </h3>
          <div className="space-y-4">
            {recentViews.length > 0 ? recentViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 text-sm hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-red-600/10 transition-all">
                    <Globe size={16} className="text-neutral-500 group-hover:text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{view.page}</p>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.15em]">
                      {view.country || "Desconhecido"} • {view.device || "Browser"}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-black text-neutral-500 tabular-nums">
                  {format(view.createdAt, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-neutral-600 space-y-2">
                <Clock size={40} strokeWidth={1} />
                <p className="text-sm font-bold uppercase tracking-widest">Aguardando dados...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
