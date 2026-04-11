"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <ShieldAlert size={40} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white tracking-tight">Acesso Bloqueado</h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Detectamos atividades suspeitas ou tentativas excessivas de login em sua rede. 
              Por segurança, este acesso foi temporariamente suspenso.
            </p>
          </div>

          {/* Details */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-neutral-500 space-y-2">
            <p className="flex justify-between items-center">
              <span>Motivo:</span>
              <span className="text-red-400 font-bold uppercase">Security Policy Violation</span>
            </p>
            <p className="flex justify-between items-center">
              <span>Status:</span>
              <span className="text-white">IP Restrito</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button variant="destructive" className="w-full flex items-center justify-center gap-2" asChild>
               <Link href="https://wa.me/5582988652775">
                  Falar com Suporte
               </Link>
            </Button>
            <Button variant="ghost" className="w-full text-neutral-500 hover:text-white" onClick={() => window.location.reload()}>
              <RefreshCw size={14} className="mr-2" /> Tentar novamente
            </Button>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Voltar para o Portfólio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
