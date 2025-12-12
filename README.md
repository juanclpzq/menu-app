# Gestor de Menú Digital con Dashboard de Administración

Aplicación fullstack que permite a un negocio (restaurante) gestionar su menú desde un dashboard de administrador y mostrarlo en un menú digital público. Proyecto de prueba técnica para Fullstack Developer.

## Descripción

Sistema completo de gestión de menú digital que incluye:

- **Menú público**: Interfaz accesible para clientes donde pueden ver productos con filtros por categoría
- **Dashboard administrativo**: Panel de control privado para gestionar el catálogo de productos
- **API REST**: Endpoints para operaciones CRUD completas
- **Base de datos**: PostgreSQL con Supabase y Row Level Security
- **Despliegue en la nube**: Aplicación desplegada y accesible vía URL pública

## Tecnologías Utilizadas

### Frontend

- **Next.js 14** - Framework React con App Router y Server-Side Rendering
- **TypeScript** - Tipado estático para mayor seguridad
- **CSS-in-JS** - Estilos inline para componentes

### Backend

- **Next.js API Routes** - API REST serverless
- **Supabase** - PostgreSQL database, autenticación y almacenamiento
- **Zod** - Validación de esquemas y datos

### Infraestructura

- **Vercel** - Despliegue y hosting
- **Supabase Storage** - Almacenamiento de imágenes
- **Edge Runtime** - Ejecución optimizada de APIs

## Funcionalidades Implementadas

### Dashboard de Administración (Privado)

El administrador puede:

- ✅ **Listar** todos los productos del menú
- ✅ **Crear** productos con:
  - Nombre (obligatorio)
  - Precio (obligatorio)
  - Descripción (opcional)
  - Categoría (obligatorio): "Entradas", "Platos Fuertes", "Bebidas", "Postres"
  - Imagen del producto (URL o archivo)
- ✅ **Editar** productos existentes
- ✅ **Eliminar** productos
- ✅ **Ver resumen** del dashboard:
  - Número total de productos
  - Número de productos por categoría
  - Precio promedio
  - Producto más caro

### Menú Digital (Público)

Disponible en `/menu` para cualquier visitante:

- ✅ Ver listado completo de productos
- ✅ Visualizar para cada producto:
  - Nombre
  - Precio
  - Imagen
  - Categoría
  - Descripción
- ✅ Filtrar productos por categoría
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Cambio entre temas: moderno minimalista y vintage retro

## Instalación y Ejecución Local

### Prerequisitos

- Node.js 18.17 o superior
- Cuenta de Supabase (gratuita)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd menu-app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear archivo `.env.local` en la raíz del proyecto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Configurar base de datos en Supabase**

   En el SQL Editor de Supabase, ejecutar:

   ```sql
   -- Crear tabla de productos
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     category TEXT NOT NULL,
     image_url TEXT,
     is_popular BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Crear bucket de almacenamiento para imágenes
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('product-images', 'product-images', true);

   -- Habilitar Row Level Security
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;

   -- Política: lectura pública
   CREATE POLICY "Allow public read access" ON products
     FOR SELECT USING (true);

   -- Política: usuarios autenticados pueden insertar
   CREATE POLICY "Allow authenticated users to insert" ON products
     FOR INSERT TO authenticated WITH CHECK (true);

   -- Política: usuarios autenticados pueden actualizar
   CREATE POLICY "Allow authenticated users to update" ON products
     FOR UPDATE TO authenticated USING (true);

   -- Política: usuarios autenticados pueden eliminar
   CREATE POLICY "Allow authenticated users to delete" ON products
     FOR DELETE TO authenticated USING (true);

   -- Políticas de Storage
   CREATE POLICY "Allow public read access to product images"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'product-images');

   CREATE POLICY "Allow authenticated users to upload product images"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (bucket_id = 'product-images');
   ```

5. **Crear usuario administrador**

   En Supabase > Authentication > Users:

   - Crear nuevo usuario con email y contraseña
   - Guardar credenciales para acceso al dashboard

6. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

7. **Acceder a la aplicación**
   - Menú público: [http://localhost:3000/menu](http://localhost:3000/menu)
   - Dashboard admin: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)

## Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Ejecutar servidor de producción
npm run lint     # Ejecutar linter
```

## Despliegue en la Nube

### Despliegue en Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar repositorio desde GitHub
3. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Hacer deploy

### URLs del Proyecto Desplegado

- **Login**: https://menu-app-pi-lime.vercel.app/
- **Menú público**: https://menu-app-pi-lime.vercel.app/menu
- **Dashboard administrativo**: https://menu-app-pi-lime.vercel.app/dashboard

## Credenciales de Prueba

Para acceder al dashboard de administración:

```
Email: admin@admin.com
Contraseña: admin
```

## Estructura del Proyecto

```
menu-app/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Rutas del dashboard (protegidas)
│   │   └── dashboard/
│   ├── (auth)/                  # Rutas de autenticación
│   │   └── login/
│   ├── api/                     # API Routes
│   │   └── products/            # CRUD de productos
│   ├── menu/                    # Página pública del menú
│   └── layout.tsx               # Layout principal
├── components/                   # Componentes React
│   ├── dashboard/               # Componentes del dashboard
│   │   ├── AdminHeader.tsx
│   │   ├── CategoryProducts.tsx
│   │   ├── ProductForm.tsx
│   │   └── StatsCards.tsx
│   └── menu/                    # Componentes del menú público
│       ├── MenuClient.tsx
│       └── VintageProductCard.tsx
├── lib/                         # Utilidades y configuración
│   ├── hooks/                   # Custom React hooks
│   ├── storage/                 # Utilidades de Supabase Storage
│   ├── supabase/                # Cliente de Supabase
│   └── validations/             # Esquemas de validación Zod
├── types/                       # Definiciones TypeScript
├── middleware.ts                # Protección de rutas
└── next.config.js               # Configuración de Next.js
```

## API Endpoints

### Públicos

- `GET /api/products` - Listar todos los productos
- `GET /api/products?category=X` - Filtrar por categoría
- `GET /api/products/:id` - Obtener un producto

### Protegidos (requieren autenticación)

- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/stats` - Estadísticas del dashboard

## Validaciones Implementadas

- Nombre: requerido, string
- Precio: requerido, número positivo
- Categoría: requerido, debe ser una de las opciones válidas
- Descripción: opcional, string
- Imagen: opcional, URL válida

## Características Técnicas

### Seguridad

- Row Level Security (RLS) en base de datos
- Autenticación con Supabase Auth
- Protección de rutas con middleware
- Validación de datos con Zod
- Headers de seguridad HTTP

### Performance

- Server-Side Rendering (SSR)
- Revalidación incremental (ISR)
- Edge Runtime para APIs
- Optimización de imágenes con Next.js Image
- Caché estratégico (60s menú, 30s dashboard)

### Experiencia de Usuario

- Diseño responsive
- Estados de carga con skeletons
- Manejo de errores con boundaries
- Tema dual (moderno/vintage)
- Interfaz intuitiva

## Historias de Usuario Implementadas

### 1. Administrador - Gestión de productos

✅ Como administrador puedo crear, editar y eliminar productos del menú para mantener la información actualizada.

### 2. Administrador - Ver estado del menú

✅ Como administrador puedo ver un resumen de los productos (totales y por categoría) para entender rápidamente la composición del menú.

### 3. Cliente - Ver menú digital

✅ Como cliente puedo ver un menú digital con nombre, precio e imagen de los productos para decidir qué pedir.

### 4. Cliente - Navegar por categorías

✅ Como cliente puedo filtrar el menú por categorías para encontrar más fácil el tipo de producto que busco.

## Autor

Proyecto desarrollado como prueba técnica para el puesto de Fullstack Developer.

## Licencia

MIT
