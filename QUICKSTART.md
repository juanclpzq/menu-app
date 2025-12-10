# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- Supabase account (free tier)

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create Project
1. Go to https://supabase.com
2. Create new project
3. Save: `Project URL` and `anon public key`

### 1.2 Run SQL Schema
In Supabase SQL Editor, paste and execute:

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read" ON products FOR SELECT USING (true);

-- Admin policy (authenticated users)
CREATE POLICY "admin_all" ON products FOR ALL 
  TO authenticated USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO products (name, description, price, category, image_url, is_popular, rating) VALUES
('Tacos de Birria', 'Tres tacos de res marinada con consomé', 145, 'Entradas', 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600', true, 4.8),
('Mole Poblano', 'Pollo bañado en mole tradicional', 195, 'Platos Fuertes', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600', true, 4.9),
('Agua de Jamaica', 'Bebida refrescante', 45, 'Bebidas', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600', false, 4.6),
('Enchiladas Verdes', 'Tortillas con salsa verde', 135, 'Platos Fuertes', 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600', true, 4.7),
('Guacamole', 'Aguacate fresco', 85, 'Entradas', 'https://images.unsplash.com/photo-1554631221-f9603e6808be?w=600', true, 4.9),
('Horchata', 'Bebida de arroz con canela', 40, 'Bebidas', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600', false, 4.5);
```

### 1.3 Create Storage Bucket
1. Go to Storage in Supabase
2. Create bucket: `product-images`
3. Make it **public**

### 1.4 Create Admin User
1. Go to Authentication > Users
2. Click "Add user"
3. Use Email signup
4. Save credentials

## Step 2: Local Setup (2 minutes)

```bash
# Navigate to project
cd menu-app

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_SUPABASE_URL=your_url_here" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here" >> .env.local

# Start development server
npm run dev
```

## Step 3: Verify (1 minute)

Open browser:
1. http://localhost:3000 → Should redirect to menu
2. http://localhost:3000/menu → Should show 6 products

Test API:
```bash
# In another terminal
node test-api.js
```

## 🎯 What's Working

✅ Complete REST API (CRUD)
✅ Public menu page with filtering
✅ Database with sample data
✅ Image storage ready
✅ Authentication setup

## 📋 API Endpoints

**Public:**
- `GET /api/products` - List products
- `GET /api/products?category=Bebidas` - Filter by category
- `GET /api/products/:id` - Get one product

**Protected (need auth token):**
- `POST /api/products` - Create
- `PATCH /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete
- `GET /api/products/stats` - Statistics

## 🔑 Testing Protected Endpoints

```bash
# Get your access token (after login):
# In browser console:
const { data } = await supabase.auth.getSession()
console.log(data.session.access_token)

# Use token in requests:
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"New Item","price":100,"category":"Test"}'
```

## 🚀 Next: Build Dashboard

Now you're ready to build the admin dashboard to manage products via UI instead of API calls!

## 🐛 Troubleshooting

**Products not showing?**
- Check Supabase SQL ran successfully
- Verify RLS policies are created
- Check console for errors

**API errors?**
- Verify `.env.local` has correct credentials
- Restart dev server after changing env vars
- Check Supabase project is active

**Images not loading?**
- Verify bucket `product-images` exists
- Verify bucket is public
- Check image URLs are valid
