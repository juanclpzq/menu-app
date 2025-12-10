// components/dashboard/StatsCards.tsx
import { ShoppingBag, Layers, DollarSign, Star } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  averagePrice: number;
  popularProducts: number;
  categoryBreakdown: Record<string, number>;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: ShoppingBag,
      label: "Total Productos",
      value: stats.totalProducts,
      color: "#8B7355",
      bgColor: "#FAF8F5",
    },
    {
      icon: Layers,
      label: "Categorías",
      value: stats.totalCategories,
      color: "#C17853",
      bgColor: "#FFF5F0",
    },
    {
      icon: DollarSign,
      label: "Precio Promedio",
      value: `$${stats.averagePrice}`,
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
    {
      icon: Star,
      label: "Productos Populares",
      value: stats.popularProducts,
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
  ];

  return (
    <>
      <style>{`
        .stats-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          transition: all 200ms ease;
          border: 1px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 36, 24, 0.12);
          border-color: #E8DCC4;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 200ms ease;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.05);
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #7A6A56;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        .categories-breakdown {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
        }

        .breakdown-title {
          font-size: 16px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 16px;
        }

        .breakdown-list {
          display: grid;
          gap: 12px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #FAF8F5;
          border-radius: 8px;
          transition: background 150ms ease;
        }

        .breakdown-item:hover {
          background: #F5EFE6;
        }

        .breakdown-category {
          font-size: 14px;
          font-weight: 500;
          color: #2D2418;
        }

        .breakdown-count {
          font-size: 14px;
          font-weight: 700;
          color: #8B7355;
          padding: 4px 12px;
          background: white;
          border-radius: 12px;
        }

        .breakdown-empty {
          text-align: center;
          padding: 32px;
          color: #7A6A56;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 28px;
          }
        }
      `}</style>

      <section className="stats-section">
        <div className="stats-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">{card.label}</span>
                  <div
                    className="stat-icon-wrapper"
                    style={{
                      backgroundColor: card.bgColor,
                      color: card.color,
                    }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="stat-value">{card.value}</div>
              </div>
            );
          })}
        </div>

        {Object.keys(stats.categoryBreakdown).length > 0 && (
          <div className="categories-breakdown">
            <h3 className="breakdown-title">Productos por Categoría</h3>
            <div className="breakdown-list">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="breakdown-item">
                    <span className="breakdown-category">{category}</span>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Object.keys(stats.categoryBreakdown).length === 0 && (
          <div className="categories-breakdown">
            <div className="breakdown-empty">
              No hay productos en el menú todavía
            </div>
          </div>
        )}
      </section>
    </>
  );
}
