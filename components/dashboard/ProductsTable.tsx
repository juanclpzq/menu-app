// components/dashboard/ProductsTable.tsx
"use client";

import { Product } from "@/types";
import { Edit, Trash2, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      router.refresh();
    } catch (error) {
      alert("Error al eliminar el producto");
      setDeleting(null);
    }
  };

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

        @media (max-width: 768px) {
          .products-table th,
          .products-table td {
            padding: 12px 8px;
          }

          .product-cell {
            min-width: 200px;
          }

          .product-description {
            display: none;
          }
        }
      `}</style>

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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={
                          product.image_url ||
                          "https://placehold.co/96x96/E8DCC4/8B7355?text=Sin+Imagen"
                        }
                        alt={product.name}
                        className="product-image"
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
                        disabled={deleting === product.id}
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
    </>
  );
}
