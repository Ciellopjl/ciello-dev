# 🚀 Ciello Victor | Full Stack Portfolio & Admin CMS

<p align="center">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/react-20232a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React" />
  <img src="https://img.shields.io/badge/tailwindcss-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/prisma-2d3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 👨‍💻 Sobre o Projeto

Este é o meu portfólio profissional e painel administrativo de alta performance. Desenvolvido com o que há de mais moderno no ecossistema **Next.js 16**, o projeto não é apenas uma vitrine visual, mas uma aplicação full stack completa com gerenciamento de conteúdo (CMS), segurança avançada e monitoramento de atividades.

> **Objetivo:** Demonstrar competência técnica em arquitetura de software, segurança web e experiência do usuário (UX).

---

## ✨ Funcionalidades Principais

### 🛡️ Segurança & Autenticação
- **NextAuth v5 (Beta):** Autenticação robusta baseada em sessões seguras.
- **Security Monitor:** Sistema integrado que registra e bloqueia tentativas de acesso não autorizadas via IP e User Agent.
- **Middlewares Protegidos:** Rotas administrativas 100% blindadas contra acessos indevidos.

### ⚙️ Admin CMS
- **Gerenciamento de Projetos:** CRUD completo para adicionar, editar e excluir projetos da vitrine.
- **Drag & Drop:** Reordenação intuitiva de projetos usando `@dnd-kit`.
- **Audit Log:** Visualização em tempo real de quem fez o quê no sistema (Criação, Edição, Deleção).
- **Publicação Dinâmica:** Controle total sobre quais projetos estão visíveis ou em rascunho.

### 🎨 Frontend & UX
- **Tailwind CSS 4:** Estilização de próxima geração com performance extrema.
- **Framer Motion:** Micro-animações fluidas e transições premium.
- **UploadThing:** Gerenciamento moderno de upload de imagens via cloud.
- **Responsive Design:** Interface adaptável de smartwatches a monitores ultra-wide.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Banco de Dados** | [PostgreSQL (Neon)](https://neon.tech/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Autenticação** | [NextAuth.js v5](https://authjs.dev/) |
| **Animações** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/) |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- PostgreSQL (ou conexão com Neon.tech)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Ciellopjl/portifolio-main.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` seguindo o `.env.example`:
   ```env
   DATABASE_URL="sua_url_postgres"
   AUTH_SECRET="sua_chave_secreta"
   GOOGLE_CLIENT_ID="seu_id"
   GOOGLE_CLIENT_SECRET="seu_secret"
   ADMIN_EMAIL="seu_email@admin.com"
   UPLOADTHING_SECRET="sua_key"
   UPLOADTHING_APP_ID="seu_id"
   ```

4. **Prepare o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 📄 Licença
Este projeto está sob a licença [MIT](LICENSE).

---

<p align="center">
  Desenvolvido por <strong>Ciello Victor</strong> 👨‍💻
  <br />
  <a href="https://www.instagram.com/_ciellopjl/">Instagram</a> • 
  <a href="https://github.com/Ciellopjl">GitHub</a> • 
  <a href="https://www.linkedin.com/in/ciello-victor-7aaa6a3ab/">LinkedIn</a>
</p>
