import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import MenuClient from "@/components/menu/MenuClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menú Digital - Cocina Mexicana Auténtica",
  description: "Explora nuestro menú de auténtica cocina mexicana con opciones modernas y vintage.",
  openGraph: {
    title: "Menú Digital - Cocina Mexicana",
    description: "Descubre nuestra carta de platillos mexicanos tradicionales",
    type: "website",
  },
};

async function getProducts(): Promise<Product[]> {
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

async function getCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data } = await supabase.from("products").select("category");

  if (!data) return [];

  const uniqueCategories = [...new Set(data.map((p) => p.category))];
  return uniqueCategories;
}

export default async function MenuPage() {
  const products = await getProducts();
  const categories = await getCategories();

  // Check session server-side for instant rendering
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const hasSession = !!session;

  return <MenuClient products={products} categories={categories} hasSession={hasSession} />;
}

export const revalidate = 60;
