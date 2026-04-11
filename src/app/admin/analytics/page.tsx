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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import VisitsChart from "@/components/analytics/VisitsChart";
import DevicesChart from "@/components/analytics/DevicesChart";
import ClicksChart from "@/components/analytics/ClicksChart";


export default async function AnalyticsPage() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

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
      take: 10
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  const viewsChartData = Object.entries(
    viewsByDay.reduce((acc: any, curr) => {
      const date = format(curr.createdAt, "dd/MM");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const deviceChartData = deviceGroups.map(g => ({
    name: g.device || "Desconhecido",
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Analytics</h1>
        <p className="text-neutral-500">Acompanhe o desempenho e alcance do seu portfólio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-[#0a0a0a] rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black mt-1 text-white">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-[#0a0a0a] rounded-[2rem] border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <TrendingUp size={18} className="text-red-500" />
            Visitas nos últimos 30 dias
          </h3>
          <div className="h-[300px] w-full">
            <VisitsChart data={viewsChartData} />
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a] rounded-[2rem] border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <Smartphone size={18} className="text-blue-500" />
            Dispositivos
          </h3>
          <div className="h-[300px] w-full">
            <DevicesChart data={deviceChartData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0a0a0a] rounded-[2rem] border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <MousePointer2 size={18} className="text-emerald-500" />
            Cliques por Link
          </h3>
          <div className="h-[300px] w-full">
            <ClicksChart data={linkChartData} />
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <Clock size={18} className="text-amber-500" />
            Acessos Recentes
          </h3>
          <div className="space-y-4">
            {recentViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Globe size={14} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{view.page}</p>
                    <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                      {view.city}, {view.country} • {view.device}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500">
                  {format(view.createdAt, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
