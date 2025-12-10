// components/dashboard/AdminHeader.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .admin-header {
          background: white;
          border-bottom: 1px solid #E8DCC4;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(45, 36, 24, 0.04);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .header-brand {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.01em;
        }

        .brand-subtitle {
          font-size: 12px;
          color: #7A6A56;
        }

        .header-nav {
          display: flex;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #7A6A56;
          text-decoration: none;
          border-radius: 6px;
          transition: all 150ms ease;
        }

        .nav-link:hover {
          background: #FAF8F5;
          color: #2D2418;
        }

        .nav-link.active {
          background: #8B7355;
          color: white;
        }

        .nav-link.active:hover {
          background: #7A6347;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .user-label {
          font-size: 11px;
          color: #7A6A56;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .user-email {
          font-size: 13px;
          font-weight: 600;
          color: #2D2418;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
          white-space: nowrap;
        }

        .button-menu {
          background: transparent;
          color: #8B7355;
          border: 1px solid #E8DCC4;
        }

        .button-menu:hover {
          background: #FAF8F5;
          border-color: #8B7355;
        }

        .button-logout {
          background: transparent;
          color: #D32F2F;
          border: 1px solid #FFCCCC;
        }

        .button-logout:hover {
          background: #FFF3F3;
          border-color: #D32F2F;
        }

        .mobile-user {
          display: none;
        }

        @media (max-width: 968px) {
          .header-nav {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 16px;
            height: 56px;
          }

          .brand-title {
            font-size: 16px;
          }

          .brand-subtitle {
            display: none;
          }

          .user-info {
            display: none;
          }

          .mobile-user {
            display: block;
            font-size: 12px;
            color: #7A6A56;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .header-button {
            padding: 6px 10px;
            font-size: 12px;
          }

          .button-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .header-left {
            gap: 16px;
          }

          .header-actions {
            gap: 4px;
          }
        }
      `}</style>

      <header className="admin-header">
        <div className="header-container">
          <div className="header-left">
            <div className="header-brand">
              <div className="brand-title">Dashboard Admin</div>
              <div className="brand-subtitle">Gestor de Menú Digital</div>
            </div>

            <nav className="header-nav">
              <Link
                href="/dashboard"
                className={`nav-link ${
                  pathname === "/dashboard" ? "active" : ""
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Inicio</span>
              </Link>
              <Link
                href="/dashboard/products"
                className={`nav-link ${
                  pathname.startsWith("/dashboard/products") ? "active" : ""
                }`}
              >
                <ShoppingBag size={16} />
                <span>Productos</span>
              </Link>
            </nav>
          </div>

          <div className="header-right">
            <div className="user-info">
              <span className="user-label">Admin</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <span className="mobile-user">{user?.email}</span>

            <div className="header-actions">
              <a
                href="/menu"
                target="_blank"
                className="header-button button-menu"
              >
                <ExternalLink size={14} />
                <span className="button-text">Ver Menú</span>
              </a>
              <button onClick={signOut} className="header-button button-logout">
                <LogOut size={14} />
                <span className="button-text">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
