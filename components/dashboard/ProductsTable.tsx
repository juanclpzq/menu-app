// components/dashboard/ProductsTable.tsx
"use client";

import { Product } from "@/types";
import { Edit, Trash2, Star, Eye, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("date");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Optimistic products state
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(
    products,
    (state, deletedId: string) => {
      return state.filter((p) => p.id !== deletedId);
    }
  );

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(optimisticProducts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [optimisticProducts]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = optimisticProducts;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        return Number(b.price) - Number(a.price);
      } else {
        // por fecha (más recientes primero)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [optimisticProducts, searchQuery, selectedCategory, sortBy]);

  const handleDelete = async (id: string, name: string) => {
    // Confirmación con toast personalizado
    const confirmed = window.confirm(`¿Estás seguro de eliminar "${name}"?`);
    if (!confirmed) return;

    const toastId = toast.loading(`Eliminando "${name}"...`);

    // Optimistic update - remove immediately from UI
    startTransition(() => {
      setOptimisticProducts(id);
    });

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      toast.success(`"${name}" eliminado correctamente`, { id: toastId });

      // Refresh to get the actual state from server
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error("Error al eliminar el producto", { id: toastId });
      // Revert optimistic update on error
      router.refresh();
    }
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "all";

  if (products.length === 0) {
    return (
      <>
        <style>{`
          .empty-state {
            background: white;
            border-radius: 12px;
            padding: 64px 32px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
            border: 1px solid #E8DCC4;
          }

          .empty-icon {
            font-size: 64px;
            margin-bottom: 24px;
            opacity: 0.5;
          }

          .empty-title {
            font-size: 20px;
            font-weight: 600;
            color: #2D2418;
            margin-bottom: 8px;
          }

          .empty-text {
            font-size: 15px;
            color: #7A6A56;
            margin-bottom: 24px;
          }

          .empty-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            color: white;
            background: #8B7355;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            cursor: pointer;
            transition: all 200ms ease;
          }

          .empty-button:hover {
            background: #7A6347;
            transform: translateY(-1px);
          }
        `}</style>

        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h2 className="empty-title">No hay productos</h2>
          <p className="empty-text">
            Comienza agregando tu primer producto al menú
          </p>
          <Link href="/dashboard/products/new" className="empty-button">
            Agregar Primer Producto
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .filters-toolbar {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
          margin-bottom: 20px;
        }

        .filters-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #7A6A56;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 44px;
          font-size: 14px;
          border: 2px solid #E8DCC4;
          border-radius: 8px;
          transition: all 200ms ease;
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
          border-color: #8B7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #7A6A56;
          cursor: pointer;
          border-radius: 4px;
          transition: all 150ms ease;
        }

        .clear-search:hover {
          background: #FAF8F5;
          color: #2D2418;
        }

        .filter-select {
          padding: 10px 14px;
          font-size: 14px;
          border: 2px solid #E8DCC4;
          border-radius: 8px;
          background: white;
          color: #2D2418;
          cursor: pointer;
          transition: all 200ms ease;
          font-family: inherit;
          font-weight: 500;
        }

        .filter-select:focus {
          outline: none;
          border-color: #8B7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .filter-select:hover {
          border-color: #8B7355;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 13px;
          font-weight: 600;
          color: #7A6A56;
          white-space: nowrap;
        }

        .results-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #FAF8F5;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #7A6A56;
        }

        .results-count {
          font-weight: 600;
          color: #2D2418;
        }

        .clear-filters-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #D32F2F;
          background: transparent;
          border: 1px solid #FFCCCC;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .clear-filters-button:hover {
          background: #FFF3F3;
          border-color: #D32F2F;
        }

        .no-results {
          background: white;
          border-radius: 12px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
        }

        .no-results-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .no-results-title {
          font-size: 18px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 8px;
        }

        .no-results-text {
          font-size: 14px;
          color: #7A6A56;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table thead {
          background: #FAF8F5;
          border-bottom: 1px solid #E8DCC4;
        }

        .products-table th {
          padding: 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #7A6A56;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .products-table tbody tr {
          border-bottom: 1px solid #F5EFE6;
          transition: background 150ms ease;
        }

        .products-table tbody tr:hover {
          background: #FAFAFA;
        }

        .products-table tbody tr:last-child {
          border-bottom: none;
        }

        .products-table td {
          padding: 16px;
          vertical-align: middle;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 250px;
        }

        .product-image {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          background: #E8DCC4;
          flex-shrink: 0;
        }

        .product-info {
          flex: 1;
          min-width: 0;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-description {
          font-size: 12px;
          color: #7A6A56;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #8B7355;
          background: #FAF8F5;
          border-radius: 4px;
          white-space: nowrap;
        }

        .price-cell {
          font-size: 15px;
          font-weight: 700;
          color: #2D2418;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .popular-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          color: #FF9800;
          background: #FFF3E0;
          border-radius: 4px;
        }

        .rating-display {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #7A6A56;
        }

        .actions-cell {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .action-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #7A6A56;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
        }

        .action-button:hover {
          background: #FAF8F5;
          color: #2D2418;
        }

        .action-button.delete {
          color: #D32F2F;
        }

        .action-button.delete:hover {
          background: #FFF3F3;
          color: #B71C1C;
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile Cards View */
        .products-cards {
          display: none;
          gap: 16px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
          transition: all 200ms ease;
        }

        .product-card:hover {
          box-shadow: 0 4px 12px rgba(45, 36, 24, 0.12);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          background: #E8DCC4;
          flex-shrink: 0;
        }

        .card-info {
          flex: 1;
          min-width: 0;
        }

        .card-name {
          font-size: 16px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 4px;
        }

        .card-description {
          font-size: 13px;
          color: #7A6A56;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F5EFE6;
        }

        .card-price {
          font-size: 18px;
          font-weight: 700;
          color: #2D2418;
        }

        .card-category {
          font-size: 13px;
          font-weight: 500;
          color: #8B7355;
          background: #FAF8F5;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .card-status {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .card-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .card-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          border: 2px solid #E8DCC4;
          background: white;
          color: #7A6A56;
          border-radius: 8px;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
          min-height: 44px;
        }

        .card-action-button:hover {
          background: #FAF8F5;
          border-color: #8B7355;
          color: #2D2418;
        }

        .card-action-button.delete {
          color: #D32F2F;
          border-color: #FFCCCC;
        }

        .card-action-button.delete:hover {
          background: #FFF3F3;
          border-color: #D32F2F;
        }

        .card-action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .table-container {
            display: none;
          }

          .products-cards {
            display: flex;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .filters-row {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .filter-group {
            width: 100%;
          }

          .filter-select {
            flex: 1;
          }

          .results-info {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Filters Toolbar */}
      <div className="filters-toolbar">
        <div className="filters-row">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, descripción o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-group">
            <SlidersHorizontal size={18} className="filter-label" />
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price" | "date")}
            >
              <option value="date">Más recientes</option>
              <option value="name">Nombre (A-Z)</option>
              <option value="price">Precio (mayor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {hasActiveFilters && (
        <div className="results-info">
          <span>
            Mostrando <span className="results-count">{filteredProducts.length}</span> de{" "}
            <span className="results-count">{products.length}</span> productos
          </span>
          <button
            className="clear-filters-button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            <X size={14} />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3 className="no-results-title">No se encontraron productos</h3>
          <p className="no-results-text">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      )}

      {/* Desktop Table View */}
      {filteredProducts.length > 0 && (
        <div className="table-container">
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <Image
                        src={
                          product.image_url ||
                          "https://placehold.co/96x96/E8DCC4/8B7355?text=Sin+Imagen"
                        }
                        alt={product.name}
                        width={48}
                        height={48}
                        className="product-image"
                        unoptimized={!product.image_url}
                      />
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">
                          {product.description || "Sin descripción"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className="price-cell">${product.price}</span>
                  </td>
                  <td>
                    <div className="status-cell">
                      {product.is_popular && (
                        <span className="popular-badge">
                          <Star size={12} fill="currentColor" />
                          Popular
                        </span>
                      )}
                      {product.rating > 0 && (
                        <span className="rating-display">
                          <Star size={12} fill="#FFB300" stroke="none" />
                          {product.rating}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <a
                        href="/menu"
                        target="_blank"
                        className="action-button"
                        title="Ver en menú"
                      >
                        <Eye size={16} />
                      </a>
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="action-button"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="action-button delete"
                        title="Eliminar"
                        disabled={isPending}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Mobile Cards View */}
      {filteredProducts.length > 0 && (
      <div className="products-cards">
        <AnimatePresence mode="popLayout">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="product-card"
          >
            <div className="card-header">
              <Image
                src={
                  product.image_url ||
                  "https://placehold.co/160x160/E8DCC4/8B7355?text=Sin+Imagen"
                }
                alt={product.name}
                width={80}
                height={80}
                className="card-image"
                unoptimized={!product.image_url}
              />
              <div className="card-info">
                <div className="card-name">{product.name}</div>
                <div className="card-description">
                  {product.description || "Sin descripción"}
                </div>
              </div>
            </div>

            <div className="card-meta">
              <span className="card-price">${product.price}</span>
              <span className="card-category">{product.category}</span>
            </div>

            {(product.is_popular || product.rating > 0) && (
              <div className="card-status">
                {product.is_popular && (
                  <span className="popular-badge">
                    <Star size={12} fill="currentColor" />
                    Popular
                  </span>
                )}
                {product.rating > 0 && (
                  <span className="rating-display">
                    <Star size={12} fill="#FFB300" stroke="none" />
                    {product.rating}
                  </span>
                )}
              </div>
            )}

            <div className="card-actions">
              <a
                href="/menu"
                target="_blank"
                className="card-action-button"
              >
                <Eye size={16} />
                <span>Ver</span>
              </a>
              <Link
                href={`/dashboard/products/${product.id}/edit`}
                className="card-action-button"
              >
                <Edit size={16} />
                <span>Editar</span>
              </Link>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                className="card-action-button delete"
                disabled={isPending}
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
      )}
    </>
  );
}
