import { z } from 'zod'

export const articleSchema = z
  .string()
  .trim()
  .min(1, 'Введите артикул детали')
  .max(64, 'Артикул не должен быть длиннее 64 символов')

export const partSchema = z.object({
  goodsID: z.string().min(1),
  brand: z.string(),
  name: z.string(),
  number: z.string(),
  price: z.number().finite().nonnegative(),
  count: z.number().int().nonnegative(),
  warehouses: z.array(
    z.object({
      id: z.string().optional(),
      code: z.string().optional(),
      price: z.number().finite().nonnegative(),
      stock: z.number().int().nonnegative(),
    }),
  ),
  analogues: z.array(z.lazy(() => partSchema)).optional(),
})

export const partsResponseSchema = z.object({
  goods: z.array(partSchema),
})

export const apiErrorSchema = z.object({
  error: z.string().min(1),
})
