"use client";

import { DEVELOPER_INFO } from "@/constants/developer";
import Link from "next/link";
import { Lock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div>
          © {currentYear} {DEVELOPER_INFO.name}. Todos os direitos reservados.
        </div>
        <div className="flex items-center gap-6">
          <a href="#about" onClick={() => trackEvent('click', 'footer', 'sobre')} className="hover:text-foreground transition-colors">Sobre</a>
          <a href="#projects" onClick={() => trackEvent('click', 'footer', 'projetos')} className="hover:text-foreground transition-colors">Projetos</a>
          <a href="#contact" onClick={() => trackEvent('click', 'footer', 'contato')} className="hover:text-foreground transition-colors">Contato</a>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Desenvolvido por ciello dev <span className="text-base">👨‍💻</span>
          </span>
          <Link href="/login" className="p-1.5 hover:bg-white/5 rounded-md hover:text-white transition-colors" title="Área Restrita">
            <Lock size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
