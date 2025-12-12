// components/dashboard/AdminHeader.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

interface AdminHeaderProps {
  userEmail: string | null;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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

        /* Add safe area spacing only in standalone/PWA mode */
        @media (display-mode: standalone) {
          .admin-header {
            padding-top: env(safe-area-inset-top, 0px);
          }
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

        .hamburger-button {
          display: none;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #2D2418;
          cursor: pointer;
          border-radius: 6px;
          transition: background 150ms ease;
        }

        .hamburger-button:hover {
          background: #FAF8F5;
        }

        .mobile-drawer-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(45, 36, 24, 0.5);
          z-index: 150;
          animation: fadeIn 250ms ease;
        }

        .mobile-drawer-overlay.open {
          display: block;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 280px;
          max-width: 85vw;
          height: 100vh;
          background: white;
          z-index: 200;
          box-shadow: -4px 0 24px rgba(45, 36, 24, 0.15);
          display: flex;
          flex-direction: column;
          transition: right 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-drawer.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #E8DCC4;
        }

        .drawer-title {
          font-size: 16px;
          font-weight: 700;
          color: #2D2418;
        }

        .close-drawer-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #7A6A56;
          cursor: pointer;
          border-radius: 6px;
          transition: all 150ms ease;
        }

        .close-drawer-button:hover {
          background: #FAF8F5;
          color: #2D2418;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .drawer-user-section {
          padding: 16px;
          background: #FAF8F5;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .drawer-user-label {
          font-size: 11px;
          color: #7A6A56;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .drawer-user-email {
          font-size: 14px;
          font-weight: 600;
          color: #2D2418;
          word-break: break-word;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .drawer-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 500;
          color: #7A6A56;
          text-decoration: none;
          border-radius: 8px;
          transition: all 150ms ease;
          min-height: 48px;
        }

        .drawer-nav-link:hover {
          background: #FAF8F5;
          color: #2D2418;
        }

        .drawer-nav-link.active {
          background: #8B7355;
          color: white;
        }

        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #E8DCC4;
        }

        .drawer-action-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
          justify-content: flex-start;
          min-height: 48px;
        }

        .drawer-button-menu {
          background: #FAF8F5;
          color: #8B7355;
        }

        .drawer-button-menu:hover {
          background: #F5EFE6;
        }

        .drawer-button-logout {
          background: #FFF3F3;
          color: #D32F2F;
        }

        .drawer-button-logout:hover {
          background: #FFEBEE;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 968px) {
          .header-nav {
            display: none;
          }

          .hamburger-button {
            display: flex;
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
            <button
              className="hamburger-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>

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
              <span className="user-email">{userEmail}</span>
            </div>
            <span className="mobile-user">{userEmail}</span>

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

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <span className="drawer-title">Menú</span>
          <button
            className="close-drawer-button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-user-section">
            <div className="drawer-user-label">Administrador</div>
            <div className="drawer-user-email">{userEmail}</div>
          </div>

          <nav className="drawer-nav">
            <Link
              href="/dashboard"
              className={`drawer-nav-link ${
                pathname === "/dashboard" ? "active" : ""
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Inicio</span>
            </Link>
            <Link
              href="/dashboard/products"
              className={`drawer-nav-link ${
                pathname.startsWith("/dashboard/products") ? "active" : ""
              }`}
            >
              <ShoppingBag size={20} />
              <span>Productos</span>
            </Link>
          </nav>

          <div className="drawer-actions">
            <a
              href="/menu"
              target="_blank"
              className="drawer-action-button drawer-button-menu"
            >
              <ExternalLink size={20} />
              <span>Ver Menú</span>
            </a>
            <button
              onClick={signOut}
              className="drawer-action-button drawer-button-logout"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
