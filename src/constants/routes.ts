export const APP_ROUTES = {
  public: {
    home: "/",
    projects: "/projects",
  },
  auth: {
    login: "/login",
    blocked: "/blocked",
  },
  admin: {
    dashboard: "/admin",
    analytics: "/admin/analytics",
    projects: {
      new: "/admin/projects/new",
      edit: (id: string) => `/admin/projects/${id}/edit`,
    },
  },
  api: {
    projects: "/api/projects",
    admin: {
      projects: "/api/admin/projects",
      analytics: {
        summary: "/api/admin/analytics/summary",
        pageview: "/api/admin/analytics/pageview",
        click: "/api/admin/analytics/click",
      },
    },
  },
};

export const NAV_LINKS = [
  { name: "Início", href: "#home" },
  { name: "Sobre", href: "#about" },
  { name: "Tecnologias", href: "#tech" },
  { name: "Projetos", href: "#projects" },
  { name: "Contato", href: "#contact" },
];
