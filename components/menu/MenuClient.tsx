"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/types";
import { ModernProductCard } from "./ModernProductCard";
import { VintageProductCard } from "./VintageProductCard";
import { LayoutDashboard, Heart, ArrowUp, Menu, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PWAInstallPrompt } from "../PWAInstallPrompt";

interface MenuClientProps {
  hasSession: boolean;
}

export default function MenuClient({
  hasSession: initialHasSession,
}: MenuClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVintage, setIsVintage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hasSession, setHasSession] = useState(initialHasSession);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const result = await response.json();
        const productsData = result.data || [];

        setProducts(productsData);

        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map((p: Product) => p.category))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Suscribirse a cambios en la autenticación (solo para actualizaciones en tiempo real)
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

  // Scroll handler for header hide/show and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide scroll to top button
      setShowScrollTop(currentScrollY > 400);

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll to content
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isFavorite) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const toggleFavoritesFilter = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    // Scroll to top when toggling filter
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Apply category filter first
  let filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Then apply favorites filter if active
  if (showFavoritesOnly) {
    filteredProducts = filteredProducts.filter((p) => favoriteIds.has(p.id));
  }

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

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
          overscroll-behavior-y: none;
        }

        .prototype-wrapper {
          min-height: 100vh;
          padding: 80px 20px 100px;
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

        .login-desktop {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 1000;
          transition: transform 300ms ease;
        }

        .login-desktop.hidden {
          transform: translateY(-120px);
        }

        .login-mobile {
          display: none;
        }

        .top-controls {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          gap: 12px;
          transition: transform 300ms ease;
        }

        /* Add safe area spacing only in standalone/PWA mode */
        @media (display-mode: standalone) {
          .login-desktop {
            top: calc(24px + env(safe-area-inset-top, 50px));
          }

          .top-controls {
            top: calc(24px + env(safe-area-inset-top, 50px));
          }

          .prototype-wrapper {
            padding-top: calc(80px + env(safe-area-inset-top, 50px));
          }
        }

        .top-controls.hidden {
          transform: translateY(-120px);
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

        .login-button {
          background: #8B7355;
          color: white;
          border-color: #8B7355;
        }

        .login-button:hover {
          background: #7A6347;
          border-color: #7A6347;
          color: white;
        }

        .vintage-mode .login-button {
          background: #D84315;
          border-color: #D84315;
          color: white;
        }

        .vintage-mode .login-button:hover {
          background: #BF360C;
          border-color: #BF360C;
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

        .cards-grid > * {
          animation: fadeInUp 400ms ease-out backwards;
        }

        .cards-grid > *:nth-child(1) { animation-delay: 0ms; }
        .cards-grid > *:nth-child(2) { animation-delay: 50ms; }
        .cards-grid > *:nth-child(3) { animation-delay: 100ms; }
        .cards-grid > *:nth-child(4) { animation-delay: 150ms; }
        .cards-grid > *:nth-child(5) { animation-delay: 200ms; }
        .cards-grid > *:nth-child(6) { animation-delay: 250ms; }
        .cards-grid > *:nth-child(n+7) { animation-delay: 300ms; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .login-desktop {
            display: none;
          }

          .login-mobile {
            display: flex;
          }

          .top-controls {
            top: 16px;
            left: 16px;
            right: 16px;
            flex-direction: row;
            justify-content: space-between;
            width: auto;
            gap: 8px;
          }

          /* Only add extra spacing in standalone/PWA mode */
          @media (display-mode: standalone) {
            .top-controls {
              top: calc(16px + env(safe-area-inset-top, 50px));
            }

            .prototype-wrapper {
              padding-top: calc(80px + env(safe-area-inset-top, 50px));
            }
          }

          .dashboard-button {
            font-size: 12px;
            padding: 10px 16px;
          }

          .dashboard-button span {
            display: none;
          }

          .toggle-switch {
            padding: 10px 16px;
          }

          .toggle-label {
            font-size: 11px;
          }

          .toggle-track {
            width: 40px;
            height: 20px;
          }

          .toggle-thumb {
            width: 16px;
            height: 16px;
          }

          .vintage-mode .toggle-thumb {
            left: 22px;
          }
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 999;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 300ms ease;
        }

        .bottom-nav.hidden {
          transform: translateY(100%);
        }

        .modern-mode .bottom-nav {
          background: white;
          border-top-color: rgba(139, 115, 85, 0.15);
        }

        .vintage-mode .bottom-nav {
          background: #F5F5DC;
          border-top: 2px solid rgba(62, 39, 35, 0.2);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-container {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding: 12px 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .nav-container::-webkit-scrollbar {
          display: none;
        }

        .nav-chip {
          flex-shrink: 0;
          padding: 10px 20px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 600;
          border: 2px solid;
          background: white;
          cursor: pointer;
          transition: all 200ms ease;
          white-space: nowrap;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .modern-mode .nav-chip {
          border-color: #E8DCC4;
          color: #7A6A56;
        }

        .modern-mode .nav-chip.active {
          background: #8B7355;
          border-color: #8B7355;
          color: white;
        }

        .modern-mode .nav-chip:hover:not(.active) {
          border-color: #8B7355;
          color: #8B7355;
        }

        .vintage-mode .nav-chip {
          border-color: rgba(62, 39, 35, 0.3);
          color: #3E2723;
          background: #F5F5DC;
          font-family: Special Elite, monospace;
        }

        .vintage-mode .nav-chip.active {
          background: #D84315;
          border-color: #D84315;
          color: white;
        }

        .vintage-mode .nav-chip:hover:not(.active) {
          border-color: #D84315;
          color: #D84315;
        }

        /* Floating Action Buttons */
        .fab-container {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 998;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          -webkit-tap-highlight-color: transparent;
        }

        .fab:active {
          transform: scale(0.95);
        }

        .fab.scroll-top {
          opacity: 0;
          visibility: hidden;
          transform: scale(0.8);
        }

        .fab.scroll-top.visible {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }

        .modern-mode .fab {
          background: #8B7355;
          color: white;
        }

        .modern-mode .fab:hover {
          background: #7A6347;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .modern-mode .fab.active {
          background: #C17853;
        }

        .modern-mode .fab.active:hover {
          background: #B36A45;
        }

        .vintage-mode .fab {
          background: #D84315;
          color: white;
        }

        .vintage-mode .fab:hover {
          background: #BF360C;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .vintage-mode .fab.active {
          background: #BF360C;
        }

        .vintage-mode .fab.active:hover {
          background: #A52F0A;
        }

        .fab-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #FF5252;
          color: white;
          border-radius: 12px;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          padding: 0 6px;
          border: 2px solid white;
        }

        @media (max-width: 768px) {
          .fab-container {
            bottom: 100px;
            right: 16px;
          }

          .fab {
            width: 52px;
            height: 52px;
          }
        }

        /* Main header transitions */
        .main-header {
          text-align: center;
          margin-bottom: 48px;
          transition: transform 300ms ease, opacity 300ms ease;
        }

        .main-header.hidden {
          transform: translateY(-20px);
          opacity: 0;
        }
      `}</style>

      {/* Top Controls - Desktop */}
      {!hasSession && (
        <div className={`login-desktop ${headerHidden ? "hidden" : ""}`}>
          <Link href="/login" className="dashboard-button login-button">
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        </div>
      )}

      {/* Top Controls */}
      <div className={`top-controls ${headerHidden ? "hidden" : ""}`}>
        {hasSession ? (
          <Link href="/dashboard" className="dashboard-button">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link href="/login" className="dashboard-button login-button login-mobile">
            <LogIn size={16} />
            <span>Login</span>
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
        </div>
      </div>

      {/* Header */}
      <header className={`main-header ${headerHidden ? "hidden" : ""}`}>
        <h1 className="main-title">
          {showFavoritesOnly ? "Mis Favoritos" : "Menú Digital"}
        </h1>
        <p className="main-subtitle">
          {showFavoritesOnly
            ? `${favoriteIds.size} ${
                favoriteIds.size === 1
                  ? "platillo favorito"
                  : "platillos favoritos"
              }`
            : isVintage
            ? "Est. 1952 • Authentic Mexican Cuisine"
            : "Cocina Mexicana Auténtica"}
        </p>
      </header>

      {/* Cards Grid */}
      <div className="cards-grid">
        {isLoading ? (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#7A6A56",
              fontSize: "16px",
              padding: "40px 20px",
            }}
          >
            Cargando menú...
          </p>
        ) : productsWithNumber.length > 0 ? (
          productsWithNumber.map((product) =>
            isVintage ? (
              <VintageProductCard key={product.id} product={product} />
            ) : (
              <ModernProductCard
                key={product.id}
                product={product}
                onFavoriteChange={(isFav) =>
                  handleFavoriteToggle(product.id, isFav)
                }
              />
            )
          )
        ) : (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#7A6A56",
              fontSize: "16px",
              padding: "40px 20px",
            }}
          >
            {showFavoritesOnly
              ? "No tienes favoritos aún. Toca el ❤️ en los platillos que te gusten."
              : "No hay productos disponibles"}
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-container" style={{ marginBottom: "10px" }}>
          <button
            className={`nav-chip ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => handleCategoryClick("")}
          >
            <Menu
              size={14}
              style={{
                marginRight: "4px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`nav-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Floating Action Buttons */}
      <div className="fab-container">
        <button
          className={`fab scroll-top ${showScrollTop ? "visible" : ""}`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
        <button
          className={`fab ${showFavoritesOnly ? "active" : ""}`}
          onClick={toggleFavoritesFilter}
          aria-label="Favorites"
        >
          <Heart size={22} fill={showFavoritesOnly ? "currentColor" : "none"} />
          {favoriteIds.size > 0 && (
            <span className="fab-badge">{favoriteIds.size}</span>
          )}
        </button>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
