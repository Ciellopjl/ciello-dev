import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-3xl">⚠</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Acesso Negado</h1>
        <p className="text-neutral-400 mb-8">
          Você não tem permissão para acessar esta área. <br />
          Este painel é restrito ao administrador.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-500 transition-all"
        >
          Voltar ao Portfólio
        </Link>
      </div>
    </div>
  );
}
