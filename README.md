# Menu Digital - Gestor de Menú con Dashboard

Sistema fullstack para gestionar menús digitales con dashboard de administración.

## 🚀 Tecnologías

- **Frontend/Backend**: Next.js 14.2+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS + Inline Styles
- **Validation**: Zod
- **Deploy**: Vercel

## 📋 Requisitos Previos

- Node.js 18+
- Una cuenta de Supabase (gratuita)
- Git

## 🔧 Configuración Inicial

### 1. Configurar Supabase

#### a) Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda tu URL y anon key

#### b) Ejecutar el schema SQL
En el SQL Editor de Supabase, ejecuta:

```sql
-- Crear tabla products
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

-- Índices para performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública
CREATE POLICY "public_read" ON products 
  FOR SELECT USING (true);

-- Política: admin completo (usuarios autenticados)
CREATE POLICY "admin_all" ON products 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);
```

#### c) Crear bucket para imágenes
1. Ve a Storage en Supabase
2. Crea un bucket llamado `product-images`
3. Márcalo como público
4. Configuración:
   - Tamaño máximo: 5MB
   - Tipos permitidos: image/jpeg, image/png, image/webp

#### d) Crear usuario admin
1. Ve a Authentication > Users
2. Crea un usuario con email/password
3. Guarda las credenciales

### 2. Configurar el proyecto

```bash
# Clonar o copiar archivos
cd menu-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
```

Edita `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Correr en desarrollo

```bash
npm run dev
```

La app estará disponible en: http://localhost:3000

## 🧪 Testing del Backend

### Probar las APIs manualmente

#### 1. GET /api/products (público)
```bash
curl http://localhost:3000/api/products
```

#### 2. POST /api/products (requiere autenticación)
Primero necesitas el token de sesión. Puedes obtenerlo:

a) Desde el navegador (después de iniciar sesión):
```javascript
// En la consola del navegador
const { data } = await supabase.auth.getSession()
console.log(data.session.access_token)
```

b) Crear un producto:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Tacos al Pastor",
    "description": "Tres tacos con carne marinada",
    "price": 120,
    "category": "Platos Fuertes",
    "image_url": "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600",
    "is_popular": true,
    "rating": 4.5
  }'
```

#### 3. GET /api/products/:id
```bash
curl http://localhost:3000/api/products/ID_DEL_PRODUCTO
```

#### 4. PATCH /api/products/:id
```bash
curl -X PATCH http://localhost:3000/api/products/ID_DEL_PRODUCTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "price": 130,
    "is_popular": false
  }'
```

#### 5. DELETE /api/products/:id
```bash
curl -X DELETE http://localhost:3000/api/products/ID_DEL_PRODUCTO \
  -H "Authorization: Bearer TU_TOKEN"
```

#### 6. GET /api/products/stats
```bash
curl http://localhost:3000/api/products/stats \
  -H "Authorization: Bearer TU_TOKEN"
```

### Insertar datos de prueba

Ejecuta en Supabase SQL Editor:

```sql
INSERT INTO products (name, description, price, category, image_url, is_popular, rating) VALUES
('Tacos de Birria', 'Tres tacos de res marinada con consomé', 145, 'Entradas', 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600', true, 4.8),
('Mole Poblano', 'Pollo bañado en mole tradicional con arroz', 195, 'Platos Fuertes', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600', true, 4.9),
('Agua de Jamaica', 'Bebida refrescante de flor de jamaica', 45, 'Bebidas', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600', false, 4.6),
('Enchiladas Verdes', 'Tortillas rellenas con salsa verde', 135, 'Platos Fuertes', 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600', true, 4.7),
('Guacamole', 'Aguacate fresco con tomate y cilantro', 85, 'Entradas', 'https://images.unsplash.com/photo-1554631221-f9603e6808be?w=600', true, 4.9),
('Horchata', 'Bebida dulce de arroz con canela', 40, 'Bebidas', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600', false, 4.5);
```

## 🌐 Ver el Menú

Una vez que tengas productos en la base de datos:

1. Abre http://localhost:3000
2. Verás el menú digital público con los productos
3. Puedes filtrar por categoría
4. Interactúa con los botones de favorito y agregar

## 📁 Estructura del Proyecto

```
menu-app/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET, POST
│   │       ├── [id]/route.ts     # GET, PATCH, DELETE
│   │       └── stats/route.ts    # GET stats
│   ├── menu/
│   │   └── page.tsx              # Página pública del menú
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── menu/
│       ├── MenuClient.tsx        # Cliente del menú
│       └── ModernProductCard.tsx # Tarjeta de producto
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Cliente browser
│   │   └── server.ts            # Cliente server
│   └── validations/
│       └── product.ts           # Schemas Zod
├── types/
│   └── index.ts                 # TypeScript types
└── package.json
```

## 🚀 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🔐 Credenciales de Prueba

**Admin Dashboard** (próximamente):
- Email: [el que creaste en Supabase]
- Password: [el que creaste en Supabase]

## 📝 Endpoints API

### Públicos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Ver producto

### Protegidos (requieren autenticación)
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/stats` - Estadísticas

## 🎯 Features Implementadas

✅ Backend API completo (CRUD)
✅ Base de datos con Supabase
✅ Validación con Zod
✅ Menú público responsivo
✅ Filtro por categoría
✅ Optimización de imágenes
✅ ISR (Incremental Static Regeneration)
✅ Edge Runtime para velocidad

## 📈 Próximos Pasos

- [ ] Dashboard de administración
- [ ] Página de login
- [ ] Subida de imágenes desde el dashboard
- [ ] Tests automatizados
- [ ] Analytics

## 🐛 Troubleshooting

**Error: Cannot find module '@supabase/ssr'**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Error: Environment variables not found**
- Verifica que `.env.local` existe
- Reinicia el servidor de desarrollo

**Error: RLS policy violation**
- Verifica que las políticas de RLS están creadas
- Verifica que el usuario está autenticado para operaciones protegidas

## 📄 Licencia

MIT
