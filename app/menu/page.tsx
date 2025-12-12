import { createClient } from "@/lib/supabase/server";
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

export default async function MenuPage() {
  // Check session server-side for instant rendering
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const hasSession = !!session;

  return <MenuClient hasSession={hasSession} />;
}

// Forzar dynamic rendering para evitar caché
export const dynamic = 'force-dynamic';
export const revalidate = 0;
