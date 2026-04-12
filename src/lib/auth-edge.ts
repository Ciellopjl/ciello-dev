// auth-edge.ts — lightweight auth config for Edge Middleware
// Uses only JWT, no Prisma, no crypto (Node.js modules not allowed in Edge)
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [], // providers not needed in middleware — only JWT validation
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        token.email = user.email;
        token.isAdmin = user.email?.trim().toLowerCase() === adminEmail;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as { isAdmin?: boolean }).isAdmin =
          token.isAdmin as boolean;
      }
      return session;
    },
  },
};

export const { auth } = NextAuth(authConfig);
