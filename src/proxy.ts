import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

// ─── Proxy (renamed from middleware in Next.js 16) ────────────────────────────
// Protects all /admin/* and /api/admin/* routes
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept admin routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Get the session via NextAuth
  const session = await auth();

  // Not authenticated → redirect to /login
  if (!session || !session.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but email NOT in whitelist → redirect to /unauthorized
  if (session.user.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Authorized admin — allow the request
  return NextResponse.next();
}

// Apply proxy to admin routes only
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
