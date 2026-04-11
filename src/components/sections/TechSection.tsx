"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import { TECH_STACK } from "@/constants/techs";
import { motion } from "framer-motion";
import { Layout, Server, Database, Code2 } from "lucide-react";

// Real image logos map
const imageMap: Record<string, string> = {
  html5: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  css3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  wind: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  motion: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",
  node: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  lock: "https://next-auth.js.org/img/logo/logo-sm.png", // NextAuth logo
  prisma: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
  layers: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/babel/babel-original.svg", // Using Babel icon as generic middleware vibe
  database: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  postgres: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  sqlite: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg",
  neon: "https://avatars.githubusercontent.com/u/74304851?s=200&v=4", // Neon DB official avatar
};

export default function Technologies() {
  const categories = [
    { title: "Front-end", data: TECH_STACK.frontend },
    { title: "Back-end", data: TECH_STACK.backend },
    { title: "Banco de Dados", data: TECH_STACK.database },
  ];

  return (
    <SectionContainer id="tech">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-4">
          Tech Stack
        </h2>
        <h3 className="text-4xl font-bold tracking-tight">Experiência com as <br /> <span className="text-muted-foreground">melhores tecnologias.</span></h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {categories.map((cat, idx) => (
          <motion.div 
            key={cat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-10 glass rounded-[2rem] border border-white/5 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary ring-1 ring-brand-primary/20">
                {idx === 0 ? <Layout size={24} /> : idx === 1 ? <Server size={24} /> : <Database size={24} />}
              </div>
              <h4 className="text-xl font-black tracking-tight">{cat.title}</h4>
            </div>
            <div className="flex flex-wrap gap-4">
              {cat.data.map((tech) => {
                const imageUrl = imageMap[tech.icon];
                
                return (
                  <div 
                    key={tech.name}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-default group/item"
                  >
                    {imageUrl ? (
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imageUrl} 
                          alt={tech.name}
                          className="w-full h-full object-contain filter transition-transform duration-300 group-hover/item:scale-110 drop-shadow-sm"
                        />
                      </div>
                    ) : (
                      <Code2 size={18} className="text-muted-foreground group-hover/item:text-brand-primary transition-colors" />
                    )}
                    <span className="text-sm font-bold tracking-tight">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
