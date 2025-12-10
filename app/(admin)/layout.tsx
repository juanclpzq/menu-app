// app/(admin)/layout.tsx
import type { Metadata } from "next";
import AdminHeader from "@/components/dashboard/AdminHeader";

export const metadata: Metadata = {
  title: "Dashboard - Gestor de Menú",
  description: "Panel de administración del menú digital",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #FAF8F5;
          color: #2D2418;
        }

        .admin-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 24px;
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 24px 16px;
          }
        }
      `}</style>

      <div className="admin-wrapper">
        <AdminHeader />
        <main className="admin-content">{children}</main>
      </div>
    </>
  );
}
