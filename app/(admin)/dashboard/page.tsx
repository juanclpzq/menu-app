// app/(admin)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentProducts from "@/components/dashboard/RecentProducts";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getDashboardStats() {
  const supabase = await createClient();

  // Total de productos
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Productos por categoría
  const { data: products } = await supabase
    .from("products")
    .select("category, price");

  const categoryCount = products?.reduce(
    (acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCategories = Object.keys(categoryCount || {}).length;

  // Precio promedio
  const averagePrice =
    products && products.length > 0
      ? products.reduce((sum, product) => sum + Number(product.price), 0) /
        products.length
      : 0;

  // Productos populares
  const { count: popularCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_popular", true);

  return {
    totalProducts: totalProducts || 0,
    totalCategories,
    averagePrice: Math.round(averagePrice * 100) / 100,
    popularProducts: popularCount || 0,
    categoryBreakdown: categoryCount || {},
  };
}

async function getRecentProducts() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return data || [];
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentProducts = await getRecentProducts();

  return (
    <>
      <style>{`
        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dashboard-title {
          font-size: 32px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.02em;
        }

        .dashboard-subtitle {
          font-size: 15px;
          color: #7A6A56;
        }

        .add-product-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
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

        .add-product-button:hover {
          background: #7A6347;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        .dashboard-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 24px;
          }

          .dashboard-title-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .add-product-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <div className="dashboard-title-row">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Resumen general del menú digital
            </p>
          </div>
          <Link href="/dashboard/products/new" className="add-product-button">
            <Plus size={18} />
            <span>Agregar Producto</span>
          </Link>
        </div>
      </div>

      <div className="dashboard-sections">
        <StatsCards stats={stats} />
        <RecentProducts products={recentProducts} />
      </div>
    </>
  );
}

// Usar ISR con revalidación cada 60 segundos para el dashboard
export const revalidate = 60;
