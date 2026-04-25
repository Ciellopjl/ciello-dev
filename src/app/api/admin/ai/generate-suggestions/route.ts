export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, currentFeatures, type = "suggest" } = await req.json();

    if (!title && !description && (!currentFeatures || currentFeatures.length === 0)) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    let prompt = "";

    if (type === "refine") {
      prompt = `
        Você é um especialista em Curadoria de Portfólios e UX. 
        Analise a lista de funcionalidades abaixo de um projeto chamado "${title}" e a sua descrição: "${description}".
        
        Lista atual: ${JSON.stringify(currentFeatures)}

        Sua tarefa é FILTRAR, SELECIONAR e REESCREVER esta lista para que:
        1. Selecione APENAS AS MELHORES e mais impactantes (limite de 5 a 6 itens).
        2. Combine funcionalidades semelhantes em um único item mais robusto.
        3. Priorize itens que demonstrem complexidade técnica ou grande valor de negócio.
        4. Use verbos de ação fortes e mantenha cada item com no máximo 60 caracteres.
        5. O objetivo é impressionar quem está vendo o portfólio, não apenas listar tarefas.

        RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
        {
          "features": ["Novidade Impactante 1", "Novidade Impactante 2"]
        }
      `;
    } else {
      prompt = `
        Você é um assistente de portfólio de desenvolvedor. 
        Analise o título e a descrição do projeto abaixo e sugira:
        1. Uma lista de tecnologias (apenas nomes, ex: React, Node.js, Tailwind CSS).
        2. Uma lista de funcionalidades (promessas de valor, ex: Autenticação segura com JWT, Dashboard em tempo real).

        Projeto:
        Título: ${title}
        Descrição: ${description}

        RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
        {
          "techs": ["tech1", "tech2"],
          "features": ["feature1", "feature2"]
        }

        Use tecnologias que você identificar no texto ou que façam sentido para o tipo de projeto descrito.
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
