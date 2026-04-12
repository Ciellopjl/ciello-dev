export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Toaster } from "sonner";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { APP_ROUTES } from "@/constants/routes";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export const metadata = {
  title: "Admin · Ciello Victor",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const adminEmail = ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  // Guard: unauthenticated → login, non-admin → unauthorized
  if (!session?.user) redirect(APP_ROUTES.auth.login);
  if (!sessionEmail || sessionEmail !== adminEmail) redirect("/unauthorized");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      
      {/* Sidebar - Fixa no Desktop, Sticky no Mobile */}
      <div 
        className="w-full md:w-64 z-50 sticky top-0 md:fixed md:top-0 md:left-0 md:h-screen bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5" 
      >
        <AdminSidebar />
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fafafa",
          },
        }}
      />
    </div>
  );
}
