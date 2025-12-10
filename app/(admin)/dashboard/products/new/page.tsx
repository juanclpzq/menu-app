// app/(admin)/dashboard/products/new/page.tsx
import ProductForm from "@/components/dashboard/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
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
        <h1 className="form-title">Nuevo Producto</h1>
        <p className="form-subtitle">
          Agrega un nuevo producto al menú digital
        </p>
      </div>

      <ProductForm />
    </>
  );
}
