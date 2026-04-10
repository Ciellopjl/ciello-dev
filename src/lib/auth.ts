import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// The admin email whitelist — only this email can access /admin
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use Prisma to persist sessions and accounts
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Use JWT strategy so we can read the token in the proxy (proxy.ts)
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 ano sem deslogar
  },

  callbacks: {
    // Restringe o acesso (Login) apenas ao email do dono do portfólio
    async signIn({ user }) {
      if (user.email !== ADMIN_EMAIL && user.email !== "ciellodev@gmail.com") {
        return false; // Bloqueia imediatamente o login de terceiros
      }
      return true; // Permite o login
    },

    // Add email and admin flag to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.email === ADMIN_EMAIL;
      }
      return token;
    },

    // Expose the admin flag to the session
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as { isAdmin?: boolean }).isAdmin =
          token.isAdmin as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
});
