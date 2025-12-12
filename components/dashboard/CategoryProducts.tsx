'use client';

import { Product } from "@/types";
import Link from "next/link";
import { Eye, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CategoryProductsProps {
  productsByCategory: Record<string, Product[]>;
}

export default function CategoryProducts({ productsByCategory }: CategoryProductsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = Object.keys(productsByCategory).sort();

  return (
    <>
      <style>{`
        .category-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .category-title {
          font-size: 18px;
          font-weight: 600;
          color: #2D2418;
        }

        .view-all-link {
          font-size: 14px;
          font-weight: 600;
          color: #8B7355;
          text-decoration: none;
          transition: all 200ms ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          background: #FAF8F5;
        }

        .view-all-link:hover {
          background: #8B7355;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.2);
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-item {
          border: 1px solid #E8DCC4;
          border-radius: 10px;
          overflow: hidden;
          background: #FAF8F5;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-item.expanded {
          background: white;
          box-shadow: 0 4px 12px rgba(45, 36, 24, 0.08);
        }

        .category-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 200ms ease;
          gap: 12px;
        }

        .category-toggle:hover {
          background: rgba(139, 115, 85, 0.05);
        }

        .category-toggle:active {
          transform: scale(0.99);
        }

        .category-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .category-name {
          font-size: 15px;
          font-weight: 600;
          color: #2D2418;
          text-align: left;
        }

        .category-count {
          font-size: 12px;
          font-weight: 600;
          color: #8B7355;
          background: white;
          padding: 4px 10px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .category-icon {
          color: #8B7355;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .category-icon.expanded {
          transform: rotate(180deg);
        }

        .category-products {
          max-height: 0;
          overflow: hidden;
          transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-products.expanded {
          max-height: 2000px;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 12px 16px 12px;
        }

        .product-item {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 12px;
          background: #FAF8F5;
          border-radius: 8px;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .product-item:hover {
          background: white;
          border-color: #E8DCC4;
          transform: translateX(4px);
          box-shadow: 0 2px 6px rgba(45, 36, 24, 0.06);
        }

        .product-image {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          background: #E8DCC4;
        }

        .product-info {
          flex: 1;
          min-width: 0;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-price {
          font-size: 13px;
          font-weight: 600;
          color: #8B7355;
        }

        .product-actions {
          display: flex;
          gap: 6px;
        }

        .action-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: white;
          color: #8B7355;
          border-radius: 6px;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          border: 1px solid #E8DCC4;
        }

        .action-button:hover {
          background: #8B7355;
          color: white;
          transform: scale(1.08);
          border-color: #8B7355;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #7A6A56;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 15px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .empty-subtext {
          font-size: 13px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .category-section {
            padding: 20px;
          }

          .category-header {
            margin-bottom: 20px;
          }

          .category-title {
            font-size: 16px;
          }

          .view-all-link {
            font-size: 13px;
            padding: 6px 12px;
          }

          .category-toggle {
            padding: 14px 16px;
          }

          .category-name {
            font-size: 14px;
          }

          .category-count {
            font-size: 11px;
            padding: 3px 8px;
          }
        }

        @media (max-width: 640px) {
          .product-item {
            grid-template-columns: 48px 1fr;
            gap: 12px;
          }

          .product-image {
            width: 48px;
            height: 48px;
          }

          .product-actions {
            grid-column: 1 / -1;
            justify-content: flex-end;
            padding-top: 8px;
            border-top: 1px solid #E8DCC4;
            margin-top: 8px;
          }

          .product-name {
            font-size: 13px;
          }

          .product-price {
            font-size: 12px;
          }

          .action-button {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 480px) {
          .category-section {
            padding: 16px;
          }

          .category-left {
            gap: 8px;
          }

          .products-list {
            padding: 0 8px 12px 8px;
          }
        }
      `}</style>

      <section className="category-section">
        <div className="category-header">
          <h2 className="category-title">Productos por Categoría</h2>
          <Link href="/dashboard/products" className="view-all-link">
            Ver todos los productos
            <span>→</span>
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="categories-list">
            {categories.map((category) => {
              const products = productsByCategory[category];
              const isExpanded = expandedCategories[category];

              return (
                <div
                  key={category}
                  className={`category-item ${isExpanded ? 'expanded' : ''}`}
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="category-toggle"
                  >
                    <div className="category-left">
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {products.length} {products.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`category-icon ${isExpanded ? 'expanded' : ''}`}
                    />
                  </button>

                  <div className={`category-products ${isExpanded ? 'expanded' : ''}`}>
                    <div className="products-list">
                      {products.map((product) => (
                        <div key={product.id} className="product-item">
                          <img
                            src={
                              product.image_url ||
                              "https://placehold.co/112x112/E8DCC4/8B7355?text=Sin+Imagen"
                            }
                            alt={product.name}
                            className="product-image"
                          />
                          <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">${product.price} MXN</div>
                          </div>
                          <div className="product-actions">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No hay productos en el menú</div>
            <div className="empty-subtext">
              Agrega tu primer producto para comenzar
            </div>
          </div>
        )}
      </section>
    </>
  );
}
