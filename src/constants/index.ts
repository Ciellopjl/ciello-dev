export const DEVELOPER_INFO = {
  name: "Ciello Victor",
  role: "Desenvolvedor Full Stack",
  age: 17,
  location: "Pão de Açúcar, Alagoas - Brasil",
  bio: "Minha conexão com a tecnologia começou ainda novo, quando meu pai montou meu primeiro computador — foi ali que nasceu a curiosidade que hoje virou profissão. Atualmente, sigo evoluindo como desenvolvedor Full Stack, criando projetos, aprendendo constantemente e transformando ideias em soluções reais. Mais do que estudar tecnologia, eu realmente gosto do que faço.",
  email: "ciellodev@gmail.com",
  whatsapp: "https://wa.me/5582988652775",
  github: "https://github.com/Ciellopjl",
  linkedin: "https://www.linkedin.com/in/ciello-victor-7aaa6a3ab/",
  profileImage: "/EU.jpeg",
};

export const TECH_STACK = {
  frontend: [
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css3" },
    { name: "Tailwind CSS", icon: "wind" },
    { name: "JavaScript", icon: "javascript" },
    { name: "TypeScript", icon: "typescript" },
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "Framer Motion", icon: "motion" },
  ],
  backend: [
    { name: "Node.js", icon: "node" },
    { name: "Next.js (App Router)", icon: "nextjs" },
    { name: "NextAuth", icon: "lock" },
    { name: "Prisma ORM", icon: "prisma" },
    { name: "Middlewares", icon: "layers" },
  ],
  database: [
    { name: "SQL", icon: "database" },
    { name: "PostgreSQL", icon: "postgres" },
    { name: "SQLite", icon: "sqlite" },
    { name: "Neon", icon: "neon" },
  ],
};

export const PROJECTS = [
  {
    id: 1,
    name: "Plataforma ENEM 2026",
    description: "Plataforma EdTech completa com inteligência artificial, focada na preparação de alta performance para o ENEM. Inclui tutor inteligente, análise de desempenho e arquitetura escalável.",
    highlights: [
      "Tutor com IA (Gemini + Llama 3)",
      "Dashboard de desempenho",
      "Chat com suporte a imagens",
      "Streaming de respostas em tempo real",
      "Sistema de autenticação avançado",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "NextAuth", "Vercel AI SDK"],
    link: "https://plataforma-enem-lyart.vercel.app",
    github: "#",
    image: "/projects/enem.png",
    featured: true,
  },
  {
    id: 2,
    name: "Silva Cílios",
    description: "Sistema completo de agendamento com painel administrativo, integração com WhatsApp e gestão de serviços e equipe.",
    highlights: [
      "Agendamento inteligente",
      "Painel admin",
      "CRUD completo",
      "Integração com WhatsApp",
      "Mobile-first",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma ORM", "SQLite", "NextAuth"],
    link: "https://www.silvacilios.com.br/",
    github: "#",
    image: "/projects/silva.png",
    featured: true,
  },
];

export const NAV_LINKS = [
  { name: "Início", href: "#home" },
  { name: "Sobre", href: "#about" },
  { name: "Tecnologias", href: "#tech" },
  { name: "Projetos", href: "#projects" },
  { name: "Contato", href: "#contact" },
];
