import { z } from 'zod'
import { stripZodDefault } from '@/schemas/utils/stripZodDefaultValues'

const ApiFilterPropsSchema = z.object({
  page: z.number().min(1, { message: 'The page must be at least 1.' }).default(1).optional(),
  per_page: z.number().min(1).max(1000, { message: 'The per_page value must not be larger than 1000' }).default(10).optional(),
  exclude: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  offset: z.number().min(1).optional(),
  orderby: z.enum(['date', 'modified', 'id', 'include', 'title', 'slug']).default('date').optional(),
})

const strippedSchema = stripZodDefault(ApiFilterPropsSchema)
export type ApiFilterProps = z.infer<typeof strippedSchema>

/**
 * Validates a given object against the ApiFilterPropsSchema and provides default values for required properties.
 */
export function validateApiFilterProps(object: any) {
  return ApiFilterPropsSchema.parse(object)
}

/**
 * Extends the ApiFilterPropsSchema with additional properties.
 * @param schema The schema to extend the ApiFilterPropsSchema with.
 * @internal
 * @example
 *
 * const ProductFilterPropsSchema = extendApiFilterPropsSchema(
 *   z.object({
 *     propX: z.string().optional(),
 *   }),
 * )
 *
 * export type ProductFilterProps = z.infer<typeof ProductFilterPropsSchema>
 */
export function extendApiFilterPropsSchema(schema: z.ZodObject<any, any>) {
  return ApiFilterPropsSchema.merge(schema)
}
