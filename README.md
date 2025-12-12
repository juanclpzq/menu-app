# Menú Digital - Restaurant Menu Management System

A modern, full-stack web application for managing and displaying restaurant menus, built with Next.js 14, Supabase, and TypeScript.

## Features

### Public Menu Interface
- **Dual Theme System**: Switch between modern minimalist and vintage retro designs
- **Category Filtering**: Browse products by category
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Real-time Updates**: Menu changes reflect immediately
- **Server-Side Rendering**: Instant page loads with zero flash

### Admin Dashboard
- **Product Management**: Full CRUD operations for menu items
- **Image Upload**: Integrated Supabase storage for product images
- **Statistics Overview**: Real-time analytics and insights
- **Secure Authentication**: Protected routes with Supabase Auth
- **Modern UI**: Clean, professional admin interface

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: CSS-in-JS with inline styles
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## Architecture Highlights

### Performance Optimizations
- **SSR Authentication**: Server-side session checks eliminate loading flashes
- **Image Optimization**: Next.js Image component with Supabase CDN
- **Route Caching**: Strategic revalidation (60s for menu, 30s for dashboard)
- **Security Headers**: Production-ready security configuration

### Code Quality
- **TypeScript Strict Mode**: Full type safety across the application
- **Error Boundaries**: Graceful error handling at route and global levels
- **Loading States**: Skeleton loaders for enhanced UX
- **ESLint + Prettier**: Consistent code formatting and linting

## Getting Started

### Prerequisites
- Node.js 18.17 or higher
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd menu-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- Create products table
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

   -- Create storage bucket for product images
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('product-images', 'product-images', true);

   -- Enable Row Level Security
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;

   -- Allow public read access
   CREATE POLICY "Allow public read access" ON products
     FOR SELECT USING (true);

   -- Allow authenticated users to manage products
   CREATE POLICY "Allow authenticated users to insert" ON products
     FOR INSERT TO authenticated WITH CHECK (true);

   CREATE POLICY "Allow authenticated users to update" ON products
     FOR UPDATE TO authenticated USING (true);

   CREATE POLICY "Allow authenticated users to delete" ON products
     FOR DELETE TO authenticated USING (true);

   -- Storage policies
   CREATE POLICY "Allow public read access to product images"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'product-images');

   CREATE POLICY "Allow authenticated users to upload product images"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (bucket_id = 'product-images');
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Public Menu: [http://localhost:3000/menu](http://localhost:3000/menu)
   - Admin Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Project Structure

```
menu-app/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin dashboard routes (protected)
│   │   └── dashboard/       
│   ├── (auth)/              # Authentication routes
│   │   └── login/
│   ├── api/                 # API routes
│   │   └── products/
│   ├── menu/                # Public menu page
│   ├── error.tsx            # Global error boundary
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── dashboard/           # Admin dashboard components
│   └── menu/                # Public menu components
├── lib/                     # Utility functions and configurations
│   ├── hooks/               # Custom React hooks
│   ├── storage/             # Supabase storage utilities
│   ├── supabase/            # Supabase client configuration
│   └── validations/         # Zod schemas
├── types/                   # TypeScript type definitions
└── middleware.ts            # Route protection middleware
```

## Key Implementation Details

### Server-Side Authentication
The application uses server-side rendering for authentication checks, eliminating client-side loading flashes:

```typescript
// Server Component
const supabase = await createClient();
const { data: { session } } = await supabase.auth.getSession();
return <Component hasSession={!!session} />
```

### Route Protection
Middleware protects admin routes and handles automatic redirects:

```typescript
// middleware.ts
if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/login', request.url))
}
```

### Image Handling
Product images are stored in Supabase Storage and optimized via Next.js Image component:

```typescript
<Image
  src={publicUrl}
  alt={product.name}
  width={400}
  height={300}
  style={{ objectFit: 'cover' }}
/>
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
The project uses:
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking

## Security Features

- **HTTP Security Headers**: XSS protection, frame options, content type sniffing prevention
- **Row Level Security**: Database-level access control via Supabase RLS
- **Protected Routes**: Middleware-based route protection
- **Secure Authentication**: Industry-standard auth via Supabase
- **Input Validation**: Zod schemas for all user inputs

## License

MIT

## Author

Created as a technical assessment project demonstrating modern full-stack development practices.
