import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_popular: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
})

export const ProductUpdateSchema = ProductSchema.partial()

export type ProductInput = z.infer<typeof ProductSchema>
