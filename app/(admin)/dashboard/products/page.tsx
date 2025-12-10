// app/(admin)/dashboard/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductsTable from "@/components/dashboard/ProductsTable";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <style>{`
        .products-header {
          margin-bottom: 32px;
        }

        .products-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .products-title {
          font-size: 32px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.02em;
        }

        .products-subtitle {
          font-size: 15px;
          color: #7A6A56;
        }

        .products-count {
          font-weight: 600;
          color: #8B7355;
        }

        .add-button {
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

        .add-button:hover {
          background: #7A6347;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        @media (max-width: 768px) {
          .products-title {
            font-size: 24px;
          }

          .products-title-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .add-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="products-header">
        <div className="products-title-row">
          <div>
            <h1 className="products-title">Productos</h1>
            <p className="products-subtitle">
              <span className="products-count">{products.length}</span>{" "}
              productos en el menú
            </p>
          </div>
          <Link href="/dashboard/products/new" className="add-button">
            <Plus size={18} />
            <span>Nuevo Producto</span>
          </Link>
        </div>
      </div>

      <ProductsTable products={products} />
    </>
  );
}

export const revalidate = 0; // Always fresh data
