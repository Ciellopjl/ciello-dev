"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import { DEVELOPER_INFO } from "@/constants/developer";
import { MapPin, Calendar, Code2 } from "lucide-react";

export default function About() {
  return (
    <SectionContainer id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-4">
            Sobre mim
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Transformando código em <br />
            <span className="text-muted-foreground">soluções de impacto.</span>
          </h3>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>{DEVELOPER_INFO.bio}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 glass rounded-2xl">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Localização</p>
                <p className="font-medium">{DEVELOPER_INFO.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass rounded-2xl">
              <div className="w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Idade</p>
                <p className="font-medium">{DEVELOPER_INFO.age} anos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full max-w-md mx-auto lg:ml-auto group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-3xl flex items-center justify-center p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/20">
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 ring-1 ring-brand-primary/20">
                  <Code2 size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Desenvolvimento Full Stack</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Construo aplicações completas — do banco de dados à interface — com Next.js, React e arquiteturas que escalam de verdade.
                </p>
             </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
