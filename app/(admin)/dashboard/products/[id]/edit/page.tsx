// app/(admin)/dashboard/products/[id]/edit/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/dashboard/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getExistingCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("category");

  if (!data) return [];

  const categories = [...new Set(data.map((p) => p.category))];
  return categories.sort();
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const categories = await getExistingCategories();

  return (
    <>
      <style>{`
        .form-header {
          margin-bottom: 32px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #7A6A56;
          text-decoration: none;
          margin-bottom: 16px;
          transition: color 150ms ease;
        }

        .back-link:hover {
          color: #2D2418;
        }

        .form-title {
          font-size: 32px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 15px;
          color: #7A6A56;
        }

        @media (max-width: 768px) {
          .form-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="form-header">
        <Link href="/dashboard/products" className="back-link">
          <ArrowLeft size={16} />
          <span>Volver a productos</span>
        </Link>
        <h1 className="form-title">Editar Producto</h1>
        <p className="form-subtitle">
          Actualiza la información de "{product.name}"
        </p>
      </div>

      <ProductForm product={product} existingCategories={categories} />
    </>
  );
}
