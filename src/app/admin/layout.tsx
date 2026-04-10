import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

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
  if (!session?.user) redirect("/login");
  if (session.user.email !== ADMIN_EMAIL) redirect("/unauthorized");

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-black overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 w-full overflow-y-auto p-4 md:p-8">
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
