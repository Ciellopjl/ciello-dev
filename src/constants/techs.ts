export const TECH_STACK = {
  frontend: [
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css3" },
    { name: "Tailwind CSS", icon: "wind" },
    { name: "JavaScript", icon: "javascript" },
    { name: "TypeScript", icon: "typescript" },
    { name: "React", icon: "react" },
    { name: "Framer Motion", icon: "motion" },
  ],
  backend: [
    { name: "Node.js", icon: "node" },
    { name: "Prisma ORM", icon: "prisma" },
    { name: "NextAuth.js", icon: "nextauth" },
    { name: "Middlewares", icon: "layers" },
  ],
  database: [
    { name: "SQL", icon: "database" },
    { name: "PostgreSQL", icon: "postgres" },
    { name: "SQLite", icon: "sqlite" },
    { name: "Neon", icon: "neon" },
  ],
};
export const TECH_ICONS: Record<string, string> = {
  // Frontend
  "react": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "nextjs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "next": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "typescript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "ts": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "javascript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "tailwind": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "tailwindcss": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "tailwind css": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "wind": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "html": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "html5": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "css": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "css3": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "framer motion": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",
  "motion": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",

  // Backend & DB
  "node": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  "prisma": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
  "postgresql": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "postgres": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "sqlite": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg",
  "neon": "https://avatars.githubusercontent.com/u/74304851?s=200&v=4",
  "mysql": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "mongodb": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  "docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "aws": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "firebase": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
  "nextauth": "https://next-auth.js.org/img/logo/logo-sm.png",
  "nextauth.js": "https://next-auth.js.org/img/logo/logo-sm.png",
  "auth": "https://next-auth.js.org/img/logo/logo-sm.png",

  // Adicionais
  "recharts": "https://recharts.org/favicon.png",
  "jspdf": "https://raw.githubusercontent.com/parallax/jsPDF/master/docs/images/jspdf-logo.png",
  "sheetjs": "https://sheetjs.com/favicon.ico",
  "jspdf & sheetjs": "https://sheetjs.com/favicon.ico",
  "sonner": "https://sonner.emilkowal.ski/favicon.ico",
  "middleware": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/backbonejs/backbonejs-original.svg",
  "vite": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",
  "zod": "https://zod.dev/logo.svg",
  "shadcn ui": "https://avatars.githubusercontent.com/u/139895814?s=200&v=4",
  "shadcn": "https://avatars.githubusercontent.com/u/139895814?s=200&v=4",
  "groq": "https://avatars.githubusercontent.com/u/13251780?s=200&v=4",
  "groq sdk": "https://avatars.githubusercontent.com/u/13251780?s=200&v=4",
  "framework": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/backbonejs/backbonejs-original.svg",
  
  // Mobile & Outros
  "flutter": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  "react native": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "expo": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/expo/expo-original.svg",
  "python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "java": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "go": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
  "rust": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  "c#": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  "supabase": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "stripe": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg",
  "cloudinary": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudinary/cloudinary-original.svg",
  "vercel": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
  "github actions": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
  "redux": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
  "axios": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/axios/axios-plain.svg",
  "graphql": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
  "apollo": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apollo/apollo-original.svg",
  "radix ui": "https://raw.githubusercontent.com/radix-ui/primitives/main/meta/favicon.ico",
  "lucide": "https://lucide.dev/favicon.ico",
  "lucide react": "https://lucide.dev/favicon.ico",
  "socket.io": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg",
  "socketio": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg",
};

export function getTechIcon(tech: string): string {
  const normalized = tech.toLowerCase().trim();
  
  // Se já estiver no mapeamento manual, retorna ele
  if (TECH_ICONS[normalized]) return TECH_ICONS[normalized];

  // Caso contrário, tenta gerar um link do Devicon dinamicamente
  // Remove espaços e pontos para o formato do Devicon
  const deviconName = normalized
    .replace(/\.js$/, "js")
    .replace(/\.ts$/, "ts")
    .replace(/\s+/g, "");

  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconName}/${deviconName}-original.svg`;
}
