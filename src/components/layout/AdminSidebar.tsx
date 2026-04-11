"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ExternalLink,
  BarChart3,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";

const navItems = [
  { href: APP_ROUTES.admin.dashboard, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: APP_ROUTES.admin.analytics, label: "Analytics", icon: BarChart3, exact: false },
  { href: APP_ROUTES.admin.projects.new, label: "Novo Projeto", icon: FolderKanban, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 h-fit md:h-screen bg-[#0a0a0a]/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 flex flex-col z-40 shrink-0 sticky top-0 md:relative">
      <div className="flex flex-col w-full">
        {/* Logo and Mobile Actions */}
        <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <span className="text-white font-black text-sm md:text-base">C.</span>
            </div>
            <div className="flex flex-col">
              <p className="font-black text-white text-sm md:text-base leading-none">Ciello Admin</p>
              <p className="text-neutral-500 text-[10px] md:text-xs text-left mt-1">Painel de Controle</p>
            </div>
          </div>

          {/* Quick Actions Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/" target="_blank" className="p-2 text-neutral-400 hover:text-white bg-white/5 border border-white/5 rounded-lg transition-colors">
              <ExternalLink size={18} />
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Navigation - Horizontal on mobile, vertical on desktop */}
        <nav className="flex flex-row md:flex-col p-2 md:p-4 gap-2 md:gap-1 overflow-x-auto no-scrollbar md:overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href.replace("/new", ""));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions - Desktop Only */}
      <div className="hidden md:flex flex-col p-4 border-t border-white/5 space-y-1 mt-auto">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
          <span>Ver Portfólio</span>
        </Link>
        <button
          id="admin-logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
