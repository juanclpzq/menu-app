// components/dashboard/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Upload, X, Loader2, Save } from "lucide-react";
import { uploadProductImage, deleteProductImage } from "@/lib/storage/images";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: Product;
  existingCategories?: string[];
}

export default function ProductForm({
  product,
  existingCategories = [],
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    is_popular: product?.is_popular || false,
    rating: product?.rating || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.image_url ? `${product.image_url}?t=${Date.now()}` : ""
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Tipo de archivo no válido. Usa JPG, PNG o WEBP");
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Archivo muy grande. Máximo 5MB");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const toastId = toast.loading(
      isEditing ? "Actualizando producto..." : "Creando producto..."
    );

    try {
      let imageUrl = formData.image_url;

      // Subir imagen si hay una nueva
      if (imageFile) {
        setUploading(true);
        toast.loading("Subiendo imagen...", { id: toastId });
        const uploadedUrl = await uploadProductImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;

          // Si estamos editando y había imagen anterior, eliminarla
          if (isEditing && product.image_url) {
            await deleteProductImage(product.image_url);
          }
        }
        setUploading(false);
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price.toString()),
        category: formData.category,
        image_url: imageUrl || null,
        is_popular: formData.is_popular,
        rating: parseFloat(formData.rating.toString()),
      };

      const url = isEditing ? `/api/products/${product.id}` : "/api/products";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      toast.success(
        isEditing
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente",
        { id: toastId }
      );

      router.push("/dashboard/products");
      router.refresh();
    } catch (err: any) {
      const errorMsg = err.message || "Error al guardar el producto";
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .form-container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06);
          border: 1px solid #E8DCC4;
          max-width: 800px;
        }

        .form-grid {
          display: grid;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2D2418;
        }

        .required {
          color: #D32F2F;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 2px solid #E8DCC4;
          border-radius: 8px;
          transition: all 200ms ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #8B7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .image-upload-area {
          border: 2px dashed #E8DCC4;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          background: #FAF8F5;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .image-upload-area:hover {
          border-color: #8B7355;
          background: #F5EFE6;
        }

        .image-upload-area.has-image {
          padding: 0;
          border: none;
          background: transparent;
        }

        .upload-icon {
          color: #8B7355;
          margin-bottom: 12px;
        }

        .upload-text {
          font-size: 14px;
          color: #7A6A56;
          margin-bottom: 4px;
        }

        .upload-hint {
          font-size: 12px;
          color: #999;
        }

        .image-preview-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .image-preview {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
        }

        .remove-image-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #D32F2F;
          transition: all 150ms ease;
        }

        .remove-image-button:hover {
          background: white;
          transform: scale(1.05);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 14px;
          font-weight: 500;
          color: #2D2418;
          cursor: pointer;
        }

        .error-message {
          background: #FFF3F3;
          border: 1px solid #FFCCCC;
          color: #D32F2F;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 8px;
        }

        .form-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .button-primary {
          color: white;
          background: #8B7355;
        }

        .button-primary:hover:not(:disabled) {
          background: #7A6347;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        .button-secondary {
          color: #7A6A56;
          background: transparent;
          border: 2px solid #E8DCC4;
        }

        .button-secondary:hover:not(:disabled) {
          background: #FAF8F5;
          border-color: #8B7355;
        }

        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group full">
            <label className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Tacos de Birria"
              required
            />
          </div>

          <div className="form-group full">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descripción del producto (opcional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Precio (MXN) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Categoría <span className="required">*</span>
              </label>
              <input
                type="text"
                list="categories-list"
                className="form-input"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Ej: Platos Fuertes"
                required
              />
              <datalist id="categories-list">
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group full">
            <label className="form-label">Imagen del Producto</label>
            <div
              className={`image-upload-area ${imagePreview ? "has-image" : ""}`}
            >
              {imagePreview ? (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-image-button"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer", display: "block" }}>
                  <Upload
                    size={32}
                    className="upload-icon"
                    style={{ margin: "0 auto" }}
                  />
                  <div className="upload-text">Click para subir imagen</div>
                  <div className="upload-hint">
                    JPG, PNG o WEBP • Máximo 5MB
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Calificación</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="form-input"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Opciones</label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="is_popular"
                  className="form-checkbox"
                  checked={formData.is_popular}
                  onChange={(e) =>
                    setFormData({ ...formData, is_popular: e.target.checked })
                  }
                />
                <label htmlFor="is_popular" className="checkbox-label">
                  Marcar como popular
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="form-button button-secondary"
              disabled={submitting || uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="form-button button-primary"
              disabled={submitting || uploading}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  <span>
                    {uploading ? "Subiendo imagen..." : "Guardando..."}
                  </span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isEditing ? "Actualizar" : "Crear"} Producto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
