// components/dashboard/RecentProducts.tsx
import { Product } from "@/types";
import Link from "next/link";
import { Eye, Edit, Clock } from "lucide-react";

interface RecentProductsProps {
  products: Product[];
}

export default function RecentProducts({ products }: RecentProductsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <style>{`
        .recent-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
        }

        .recent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .recent-title {
          font-size: 18px;
          font-weight: 600;
          color: #2D2418;
        }

        .view-all-link {
          font-size: 14px;
          font-weight: 600;
          color: #8B7355;
          text-decoration: none;
          transition: color 150ms ease;
        }

        .view-all-link:hover {
          color: #7A6347;
          text-decoration: underline;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-item {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 12px;
          background: #FAF8F5;
          border-radius: 8px;
          transition: all 150ms ease;
        }

        .product-item:hover {
          background: #F5EFE6;
          transform: translateX(4px);
        }

        .product-image {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          object-fit: cover;
          background: #E8DCC4;
        }

        .product-info {
          flex: 1;
          min-width: 0;
        }

        .product-name {
          font-size: 15px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .product-category {
          font-size: 12px;
          color: #7A6A56;
          padding: 2px 8px;
          background: white;
          border-radius: 4px;
        }

        .product-price {
          font-size: 13px;
          font-weight: 600;
          color: #8B7355;
        }

        .product-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #7A6A56;
        }

        .product-actions {
          display: flex;
          gap: 8px;
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
          transition: all 150ms ease;
          text-decoration: none;
        }

        .action-button:hover {
          background: #8B7355;
          color: white;
          transform: scale(1.05);
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
        }

        .empty-subtext {
          font-size: 13px;
          opacity: 0.7;
        }

        @media (max-width: 640px) {
          .product-item {
            grid-template-columns: 50px 1fr;
            gap: 12px;
          }

          .product-actions {
            grid-column: 1 / -1;
            justify-content: flex-end;
            padding-top: 8px;
            border-top: 1px solid #E8DCC4;
            margin-top: 8px;
          }

          .product-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>

      <section className="recent-section">
        <div className="recent-header">
          <h2 className="recent-title">Productos Recientes</h2>
          <Link href="/dashboard/products" className="view-all-link">
            Ver todos →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="products-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <img
                  src={
                    product.image_url ||
                    "https://placehold.co/120x120/E8DCC4/8B7355?text=Sin+Imagen"
                  }
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-price">${product.price} MXN</span>
                    <span className="product-date">
                      <Clock size={12} />
                      {formatDate(product.created_at)}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <a
                    href={`/menu`}
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
