export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface SuggestionRequest {
  title?: string;
  description?: string;
  currentFeatures?: string[];
  type?: "suggest" | "refine";
  githubUrl?: string;
  pastedText?: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      title, 
      description, 
      currentFeatures, 
      type = "suggest", 
      githubUrl, 
      pastedText 
    }: SuggestionRequest = await req.json();

    if (!title && !description && (!currentFeatures || currentFeatures.length === 0) && !githubUrl && !pastedText) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    let prompt = "";
    let context = "";

    // Se houver um GitHub URL, tentamos buscar o README para dar mais contexto
    if (githubUrl && githubUrl.toLowerCase().includes("github")) {
      try {
        let owner: string | undefined;
        let repo: string | undefined;
        
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        
        if (match) {
          owner = match[1];
          repo = match[2].replace(".git", "").split("#")[0].split("?")[0];
        } else {
          // Fallback para outros formatos (ex: raw.githubusercontent.com)
          const parts = githubUrl.split("/");
          const githubIdx = parts.findIndex((p: string) => p.includes("github"));
          if (githubIdx !== -1 && parts.length > githubIdx + 2) {
            owner = parts[githubIdx + 1];
            repo = parts[githubIdx + 2].replace(".git", "").split("#")[0].split("?")[0];
          }
        }

        if (owner && repo) {
          const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: {
              Accept: "application/vnd.github.v3.raw",
              "User-Agent": "Portfolio-AI-Assistant"
            },
            next: { revalidate: 3600 } // Cache do README por 1 hora
          });
          
          if (readmeRes.ok) {
            const readmeText = await readmeRes.text();
            context = `\nConteúdo do README do GitHub (contexto técnico):\n${readmeText.slice(0, 5000)}`;
          }
        }
      } catch (e) {
        console.error("[Senior AI Assistant] Error fetching README:", e);
      }
    }

    if (pastedText) {
      context += `\nTexto adicional colado pelo usuário:\n${pastedText}`;
    }

    const knownTechs = ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Prisma", "Node.js", "PostgreSQL", "Groq SDK", "Framer Motion", "NextAuth.js", "Supabase", "Stripe", "Cloudinary", "Vercel", "Zod", "Shadcn UI", "Recharts", "Redux", "GraphQL", "Socket.io"];

    if (type === "refine") {
      prompt = `
        Você é um especialista em Curadoria de Portfólios e UX. 
        Analise a lista de funcionalidades abaixo de um projeto chamado "${title}" e a sua descrição: "${description}".
        ${context}
        
        Lista atual: ${JSON.stringify(currentFeatures)}

        Sua tarefa é FILTRAR, SELECIONAR e REESCREVER esta lista para que:
        1. Selecione APENAS AS MELHORES e mais impactantes (limite de 5 a 6 itens).
        2. Combine funcionalidades semelhantes em um único item mais robusto.
        3. Priorize itens que demonstrem complexidade técnica ou grande valor de negócio.
        4. Use verbos de ação fortes e mantenha cada item com no máximo 60 caracteres.

        RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
        {
          "features": ["Novidade Impactante 1", "Novidade Impactante 2"]
        }
      `;
    } else {
      prompt = `
        Você é um assistente de portfólio de desenvolvedor. 
        Analise as informações abaixo e o README (se disponível) e sugira:
        1. Uma lista de tecnologias (use preferencialmente estes nomes: ${knownTechs.join(", ")}).
        2. Uma lista de funcionalidades (promessas de valor, ex: Autenticação segura com JWT, Dashboard em tempo real).

        Projeto:
        Título: ${title}
        Descrição: ${description}
        ${context}

        RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
        {
          "techs": ["tech1", "tech2"],
          "features": ["feature1", "feature2"]
        }

        Priorize as tecnologias que estão explicitamente no README ou contexto.
        Seja conciso nas funcionalidades (máximo 60 caracteres por item).
      `;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um gerador de JSON para desenvolvedores. Nunca retorne explicações, apenas o objeto JSON solicitado.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
