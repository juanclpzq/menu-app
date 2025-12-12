"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { ModernProductCard } from "./ModernProductCard";
import { VintageProductCard } from "./VintageProductCard";
import { X, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface MenuClientProps {
  products: Product[];
  categories: string[];
}

export default function MenuClient({ products, categories }: MenuClientProps) {
  const [isVintage, setIsVintage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión activa
    const checkSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
    };

    checkSession();

    // Suscribirse a cambios en la autenticación
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Transform products to add number field for vintage cards
  const productsWithNumber = filteredProducts.map((product, index) => ({
    ...product,
    number: String(index + 1).padStart(2, "0"),
  }));

  return (
    <div
      className={`prototype-wrapper ${
        isVintage ? "vintage-mode" : "modern-mode"
      }`}
    >
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap);

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        }

        .prototype-wrapper {
          min-height: 100vh;
          padding: 80px 20px 40px;
          transition: background 400ms ease;
          position: relative;
        }

        .prototype-wrapper.modern-mode {
          background: #FAF8F5;
          color: #2D2418;
        }

        .prototype-wrapper.vintage-mode {
          background: #D7CCC8;
          background-image: 
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,.03) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0,0,0,.03) 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,.03) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0,0,0,.03) 3px
            );
        }

        .top-controls {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          gap: 12px;
        }

        .dashboard-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 2px solid #8B7355;
          border-radius: 50px;
          color: #8B7355;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 200ms ease;
        }

        .dashboard-button:hover {
          background: #8B7355;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .vintage-mode .dashboard-button {
          border-color: #D84315;
          color: #D84315;
          font-family: Special Elite, monospace;
        }

        .vintage-mode .dashboard-button:hover {
          background: #D84315;
          color: white;
        }

        .toggle-container {
          position: relative;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: white;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 200ms ease;
        }

        .toggle-switch:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .toggle-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          user-select: none;
        }

        .modern-mode .toggle-label {
          color: #8B7355;
        }

        .vintage-mode .toggle-label {
          color: #3E2723;
          font-family: Special Elite, monospace;
        }

        .toggle-track {
          width: 48px;
          height: 24px;
          border-radius: 12px;
          position: relative;
          transition: all 300ms ease;
        }

        .modern-mode .toggle-track {
          background: #E8DCC4;
        }

        .vintage-mode .toggle-track {
          background: #D84315;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .vintage-mode .toggle-thumb {
          left: 26px;
        }

        .tooltip-bubble {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: tooltipFadeIn 300ms ease;
          border: 2px solid;
        }

        .modern-mode .tooltip-bubble {
          border-color: #C17853;
        }

        .vintage-mode .tooltip-bubble {
          border-color: #D84315;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip-bubble::before {
          content: ;
          position: absolute;
          top: -8px;
          right: 24px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid;
        }

        .modern-mode .tooltip-bubble::before {
          border-bottom-color: #C17853;
        }

        .vintage-mode .tooltip-bubble::before {
          border-bottom-color: #D84315;
        }

        .tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .tooltip-title {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
        }

        .modern-mode .tooltip-title {
          color: #8B7355;
        }

        .vintage-mode .tooltip-title {
          color: #3E2723;
          font-family: Special Elite, monospace;
        }

        .tooltip-close {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 150ms ease;
          flex-shrink: 0;
        }

        .tooltip-close:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .modern-mode .tooltip-close {
          color: #8B7355;
        }

        .vintage-mode .tooltip-close {
          color: #D84315;
        }

        .tooltip-text {
          font-size: 13px;
          line-height: 1.5;
          color: #666;
        }

        .main-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .main-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          transition: all 300ms ease;
        }

        .modern-mode .main-title {
          color: #8B7355;
        }

        .vintage-mode .main-title {
          font-family: Playfair Display, serif;
          font-weight: 900;
          color: #3E2723;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .main-subtitle {
          font-size: 16px;
          font-weight: 400;
          transition: all 300ms ease;
        }

        .modern-mode .main-subtitle {
          color: #7A6A56;
        }

        .vintage-mode .main-subtitle {
          font-family: Special Elite, monospace;
          font-size: 14px;
          color: #3E2723;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0.7;
        }

        .category-filter {
          max-width: 1200px;
          margin: 0 auto 32px;
          text-align: center;
        }

        .category-select {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid;
          border-radius: 24px;
          background: white;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .modern-mode .category-select {
          border-color: #8B7355;
          color: #8B7355;
        }

        .modern-mode .category-select:hover {
          background: #8B7355;
          color: white;
        }

        .vintage-mode .category-select {
          border-color: #D84315;
          color: #3E2723;
          font-family: Special Elite, monospace;
        }

        .vintage-mode .category-select:hover {
          background: #D84315;
          color: white;
        }

        .category-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.2);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .top-controls {
            top: 16px;
            right: 16px;
            flex-direction: column;
            width: auto;
          }

          .dashboard-button,
          .toggle-switch {
            width: auto;
          }
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Top Controls */}
      <div className="top-controls">
        {hasSession && (
          <Link href="/dashboard" className="dashboard-button">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
        )}

        <div className="toggle-container">
          <div
            className="toggle-switch"
            onClick={() => setIsVintage(!isVintage)}
          >
            <span className="toggle-label">
              {isVintage ? "Vintage" : "Moderna"}
            </span>
            <div className="toggle-track">
              <div className="toggle-thumb"></div>
            </div>
          </div>

          {showTooltip && (
            <div className="tooltip-bubble">
              <div className="tooltip-header">
                <div className="tooltip-title">
                  Prueba la versión {isVintage ? "moderna" : "vintage"}
                </div>
                <button
                  className="tooltip-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="tooltip-text">
                Cambia entre el diseño{" "}
                {isVintage ? "minimalista moderno" : "retro vintage"} para ver
                diferentes estilos del menú.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="main-header">
        <h1 className="main-title">Menú Digital</h1>
        <p className="main-subtitle">
          {isVintage
            ? "Est. 1952 • Authentic Mexican Cuisine"
            : "Cocina Mexicana Auténtica"}
        </p>
      </header>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="category-filter">
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cards Grid */}
      <div className="cards-grid">
        {productsWithNumber.length > 0 ? (
          productsWithNumber.map((product) =>
            isVintage ? (
              <VintageProductCard key={product.id} product={product} />
            ) : (
              <ModernProductCard key={product.id} product={product} />
            )
          )
        ) : (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#7A6A56",
            }}
          >
            No hay productos disponibles
          </p>
        )}
      </div>
    </div>
  );
}
