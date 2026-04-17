import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currículo | Ciello Victor",
  description: "Currículo profissional de Ciello Victor - Desenvolvedor Full Stack",
};

export default function CurriculoPage() {
  return (
    <div className="fixed inset-0 bg-background z-[100]">
      <iframe
        src="/curriculo.pdf#toolbar=0"
        className="w-full h-full border-none"
        title="Currículo Ciello Victor"
      />
      
      {/* Botão flutuante para voltar ou baixar */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <a 
          href="/"
          className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all shadow-2xl"
        >
          Voltar ao Site
        </a>
        <a 
          href="/curriculo.pdf"
          download="Curriculo-Ciello-Victor.pdf"
          className="px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20"
        >
          Baixar PDF
        </a>
      </div>
    </div>
  );
}
