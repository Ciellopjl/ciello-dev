"use client";

import { motion } from "framer-motion";
import { DEVELOPER_INFO } from "@/constants/developer";
import { ArrowRight, Github } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 blur-[120px] rounded-full -z-10 animate-pulse delay-700" />
      
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-20 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-10 w-2 h-2 bg-red-500 rounded-full animate-bounce" />
        <div className="absolute top-3/4 left-20 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-red-400 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 lg:py-0">
        <div className="text-center lg:text-left order-2 lg:order-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/10 glass text-sm font-medium text-red-500/80"
          >
            Disponível para novos projetos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
          >
            {DEVELOPER_INFO.name} <br />
            <span className="text-gradient">
              {DEVELOPER_INFO.role}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-neutral-400 mb-12"
          >
            5 meses de código. Projetos reais. Zero desculpas.
            <br />
            Com 17 anos e menos de um ano na área, já construo aplicações Full Stack completas — do banco de dados à interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a
              href="#projects"
              onClick={() => trackEvent('click', 'hero', 'ver_projetos')}
              className="group px-10 py-5 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/40"
            >
              Ver Projetos
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={DEVELOPER_INFO.github}
              onClick={() => trackEvent('click', 'hero', 'github')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 glass rounded-full font-bold flex items-center gap-2 hover:bg-white/5 transition-all hover:scale-105 active:scale-95 text-neutral-200"
            >
              <Github size={20} />
              GitHub
            </a>
            <a
              href={DEVELOPER_INFO.resume}
              onClick={() => trackEvent('click', 'hero', 'curriculo')}
              className="px-10 py-5 glass rounded-full font-bold flex items-center gap-2 hover:bg-white/5 transition-all hover:scale-105 active:scale-95 text-neutral-200"
            >
              Currículo
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative order-1 lg:order-2 z-10"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] mx-auto">
            {/* Super Bloom Effect */}
            <div className="absolute inset-0 bg-red-600/30 blur-[120px] rounded-full animate-pulse -z-10" />
            
            <div className="relative w-full h-full rounded-[4rem] overflow-hidden border-2 border-red-500/20 glass-premium group shadow-2xl shadow-red-600/10">
              <img 
                src={DEVELOPER_INFO.profileImage} 
                alt={DEVELOPER_INFO.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
            
            {/* Dynamic Accents */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-600/15 rounded-3xl blur-3xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-red-800/10 rounded-full blur-[80px]" />
          </div>
        </motion.div>
      </div>

      {/* Hero shadow floor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
