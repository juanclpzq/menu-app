import { createClient } from "@/lib/supabase/client";

export async function uploadProductImage(file: File): Promise<string | null> {
  const supabase = createClient();

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  if (!validTypes.includes(file.type)) {
    throw new Error(
      "Tipo de archivo no válido. Use JPG, PNG, WEBP, HEIC o HEIF"
    );
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Archivo muy grande. Máximo 5MB");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error("Error al subir la imagen");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return false;

  const supabase = createClient();
  const urlParts = imageUrl.split("/product-images/");
  if (urlParts.length !== 2) return false;

  const fileName = urlParts[1];

  const { error } = await supabase.storage
    .from("product-images")
    .remove([fileName]);

  return !error;
}

export function validateImageFile(file: File): string | null {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  if (!validTypes.includes(file.type)) {
    return "Tipo de archivo no válido. Use JPG, PNG, WEBP, HEIC o HEIF";
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "Archivo muy grande. Máximo 5MB";
  }

  return null;
}
