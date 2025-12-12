// components/dashboard/StatsCards.tsx
"use client";

import { ShoppingBag, Layers, DollarSign, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  averagePrice: number;
  popularProducts: number;
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
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
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
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
