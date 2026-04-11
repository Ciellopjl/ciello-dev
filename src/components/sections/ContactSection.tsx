"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import { DEVELOPER_INFO } from "@/constants/developer";
import { Mail, MessageCircle, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Contact() {
  const contactMethods = [
    {
      name: "E-mail",
      value: DEVELOPER_INFO.email,
      icon: Mail,
      href: `mailto:${DEVELOPER_INFO.email}`,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      name: "WhatsApp",
      value: "Conversar agora",
      icon: MessageCircle,
      href: DEVELOPER_INFO.whatsapp,
      color: "bg-green-500/10 text-green-500"
    },
    {
      name: "GitHub",
      value: "@Ciellopjl",
      icon: Github,
      href: DEVELOPER_INFO.github,
      color: "bg-zinc-500/10 text-zinc-500"
    },
    {
      name: "LinkedIn",
      value: "Conectar",
      icon: Linkedin,
      href: DEVELOPER_INFO.linkedin,
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      name: "Instagram",
      value: "@_ciellopjl",
      icon: Instagram,
      href: DEVELOPER_INFO.instagram,
      color: "bg-pink-500/10 text-pink-500"
    }
  ];

  return (
    <SectionContainer id="contact">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-4">
            Contato
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Vamos construir algo <br /> <span className="text-muted-foreground">incrível juntos?</span>
          </h3>
          <p className="text-muted-foreground text-lg">
            Sinta-se à vontade para entrar em contato para projetos, parcerias ou apenas para dar um oi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.name}
                href={method.href}
                onClick={() => trackEvent('click', 'contato', method.name.toLowerCase())}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 glass rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{method.name}</p>
                    <p className="font-semibold text-lg">{method.value}</p>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
