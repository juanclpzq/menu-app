export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_popular: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_popular?: boolean;
  rating?: number;
}

export interface ProductStats {
  total_products: number;
  products_by_category: { category: string; count: number }[];
  average_price: number;
}
