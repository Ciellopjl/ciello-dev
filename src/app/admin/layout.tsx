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

  // Guard: unauthenticated → login, non-admin → unauthorized
  if (!session?.user) redirect(APP_ROUTES.auth.login);
  if (session.user.email !== ADMIN_EMAIL) redirect("/unauthorized");

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      
      {/* Sidebar Wrapper */}
      <div 
        className="w-full md:w-64 z-50 sticky top-0 md:fixed md:top-0 md:left-0 md:h-screen" 
        style={{ 
          backgroundColor: '#0a0a0a', 
          borderRight: '1px solid #27272a' 
        }}
      >
        <AdminSidebar />
      </div>

      {/* Container Principal */}
      <div className="w-full md:pl-64" style={{ minHeight: '100vh' }}>
        <main 
          style={{ 
            display: 'block',
            padding: '24px', 
            margin: 0, 
            width: '100%' 
          }}
        >
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
