export const dynamic = 'force-dynamic';
export const revalidate = 0;

import "@/lib/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AnalyticsTracker } from "@/lib/analytics";
import CookieNotice from "@/components/layout/CookieNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ciello Victor | Desenvolvedor Full Stack",
  description: "Portfólio profissional de Ciello Victor, Desenvolvedor Full Stack especializado em React e TypeScript. Criando aplicações modernas e escaláveis.",
  keywords: ["Desenvolvedor Full Stack", "React", "TypeScript", "Portfólio", "Ciello Victor", "Alagoas"],
  authors: [{ name: "Ciello Victor" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-red-500/30`}
    >
      <body className="min-h-screen bg-black flex flex-col">
        {children}
        <AnalyticsTracker />
        <CookieNotice />
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
