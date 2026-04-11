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
    <div className="flex flex-col min-h-screen bg-black">
      <div className="sticky top-0 z-50 md:fixed md:w-64 md:h-screen md:top-0 md:left-0">
        <AdminSidebar />
      </div>

      <main className="flex-1 flex flex-col w-full md:ml-64 min-h-screen overflow-x-hidden p-4 md:p-8">
        {children}
      </main>

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
