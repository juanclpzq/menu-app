import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// GET /api/products/stats - Get product statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get products by category
    const { data: categoryData } = await supabase
      .from('products')
      .select('category')

    const categoryCount = categoryData?.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})

    const productsByCategory = Object.entries(categoryCount || {}).map(([category, count]) => ({
      category,
      count: count as number,
    }))

    // Get average price
    const { data: priceData } = await supabase
      .from('products')
      .select('price')

    const averagePrice = priceData && priceData.length > 0
      ? priceData.reduce((sum, product) => sum + Number(product.price), 0) / priceData.length
      : 0

    return NextResponse.json({
      data: {
        total_products: totalCount || 0,
        products_by_category: productsByCategory,
        average_price: Math.round(averagePrice * 100) / 100,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
