import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import MenuClient from "@/components/menu/MenuClient";

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

  return <MenuClient products={products} categories={categories} />;
}

export const revalidate = 60;
