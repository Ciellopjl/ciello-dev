import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Normalizar email do ambiente (trim e lowercase)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

/**
 * ─── MIDDLEWARE (Security Layer) ─────────────────────────────────────────────
 * Proteção absoluta para rotas administrativas.
 * Se o ADMIN_EMAIL não estiver configurado corretamente, bloqueia o acesso por segurança.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Interceptar apenas rotas administrativas (incluindo a raiz /admin)
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  // FAIL-SAFE: Se o email do admin não estiver configurado no .env, ninguém entra
  if (!ADMIN_EMAIL) {
    console.error("[FATAL SECURITY] ADMIN_EMAIL não configurado no .env. Acesso bloqueado.");
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // Verificar sessão via NextAuth
  const session = await auth();

  // 1. Sem sessão → Redireciona para login com callback
  if (!session || !session.user || !session.user.email) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Com sessão mas email não autorizado → Redireciona para /blocked
  const userEmail = session.user.email.trim().toLowerCase();
  
  if (userEmail !== ADMIN_EMAIL) {
    console.warn(`[SECURITY] Acesso bloqueado: ${userEmail} tentou acessar ${pathname}`);
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // 3. Autorizado — Prossegue com a requisição
  return NextResponse.next();
}

// Configuração do Matcher para garantir cobertura total
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
