#!/usr/bin/env node

/**
 * API Test Script - Menu App
 * 
 * Tests all API endpoints and optionally creates sample data
 * 
 * Usage:
 *   node test-api.js              # Just test endpoints
 *   node test-api.js --populate   # Test + create sample data
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Sample products data
const sampleProducts = [
  {
    name: 'Tacos de Birria',
    description: 'Tres tacos de res marinada con consomé, cebolla, cilantro y salsa verde',
    price: 145,
    category: 'Entradas',
    image_url: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&q=80',
    is_popular: true,
    rating: 4.8
  },
  {
    name: 'Mole Poblano',
    description: 'Pollo bañado en mole tradicional con arroz mexicano y tortillas hechas a mano',
    price: 195,
    category: 'Platos Fuertes',
    image_url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    is_popular: true,
    rating: 4.9
  },
  {
    name: 'Agua de Jamaica',
    description: 'Bebida refrescante de flor de jamaica con hierbabuena',
    price: 45,
    category: 'Bebidas',
    image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',
    is_popular: false,
    rating: 4.6
  },
  {
    name: 'Enchiladas Verdes',
    description: 'Tortillas rellenas bañadas en salsa verde con crema',
    price: 135,
    category: 'Platos Fuertes',
    image_url: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&q=80',
    is_popular: true,
    rating: 4.7
  },
  {
    name: 'Guacamole Fresco',
    description: 'Aguacate fresco con tomate, cilantro y limón',
    price: 85,
    category: 'Entradas',
    image_url: 'https://images.unsplash.com/photo-1554631221-f9603e6808be?w=600&q=80',
    is_popular: true,
    rating: 4.9
  },
  {
    name: 'Horchata',
    description: 'Bebida dulce de arroz con canela y vainilla',
    price: 40,
    category: 'Bebidas',
    image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&q=80',
    is_popular: false,
    rating: 4.5
  }
];

async function testAPI() {
  console.log('🧪 Testing Menu App API\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const shouldPopulate = process.argv.includes('--populate');

  try {
    // Test 1: GET /api/products
    console.log('1️⃣  Testing GET /api/products...');
    const getResponse = await fetch(`${BASE_URL}/api/products`);
    const getResult = await getResponse.json();
    
    if (getResponse.ok) {
      console.log(`   ✅ Success! Found ${getResult.data?.length || 0} products`);
      
      if (getResult.data?.length > 0) {
        console.log(`   First product: ${getResult.data[0].name}`);
      }
    } else {
      console.log(`   ❌ Failed: ${getResult.error}`);
    }

    // Test 2: GET /api/products with category filter
    console.log('\n2️⃣  Testing GET /api/products?category=Bebidas...');
    const filterResponse = await fetch(`${BASE_URL}/api/products?category=Bebidas`);
    const filterResult = await filterResponse.json();
    
    if (filterResponse.ok) {
      console.log(`   ✅ Success! Found ${filterResult.data?.length || 0} beverages`);
    } else {
      console.log(`   ❌ Failed: ${filterResult.error}`);
    }

    // Populate data if requested
    if (shouldPopulate) {
      console.log('\n3️⃣  Populating sample data...');
      console.log('   ⚠️  Note: This requires authentication');
      console.log('   To populate data, you can:');
      console.log('   a) Use the SQL script from README.md');
      console.log('   b) Create products via authenticated dashboard');
      console.log('\n   Sample SQL:');
      console.log('   -------------------');
      
      const sqlValues = sampleProducts.map(p => 
        `('${p.name}', '${p.description}', ${p.price}, '${p.category}', '${p.image_url}', ${p.is_popular}, ${p.rating})`
      ).join(',\n   ');
      
      console.log(`   INSERT INTO products (name, description, price, category, image_url, is_popular, rating) VALUES`);
      console.log(`   ${sqlValues};`);
      console.log('   -------------------');
    }

    console.log('\n✨ API test completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. If no products found, run the SQL script from README.md in Supabase');
    console.log('   2. Visit http://localhost:3000/menu to see the menu');
    console.log('   3. Build the dashboard to manage products via UI');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Next.js dev server is running (npm run dev)');
    console.log('   - Environment variables are configured');
    console.log('   - Supabase project is set up');
  }
}

// Run the tests
testAPI();
