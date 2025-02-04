import { z, ZodRawShape } from 'zod'
import { stripZodDefault } from '@/schemas/utils/stripZodDefaultValues'

const BaseFilterPropsSchema = z.object({
  page: z.number().min(1, { message: 'The page must be at least 1.' }).default(1).optional(),
  per_page: z.number().min(1).max(1000, { message: 'The per_page value must not be larger than 1000' }).default(10).optional(),
  exclude: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  offset: z.number().min(1).optional(),
  orderby: z.enum(['date', 'modified', 'id', 'include', 'title', 'slug']).default('date').optional(),
})

const strippedSchema = stripZodDefault(BaseFilterPropsSchema)
export type BaseFilterProps = z.infer<typeof strippedSchema>

/**
 * Validates a given object against the BaseFilterPropsSchema and provides default values for required properties.
 */
export function validateBaseFilterProps(object: any) {
  return BaseFilterPropsSchema.parse(object)
}

/**
 * Extends the BaseFilterPropsSchema with additional properties.
 * @param schema The schema to extend the BaseFilterPropsSchema with.
 * @internal
 * @example
 *
 * const ProductFilterPropsSchema = extendBaseFilterPropsSchema({
 *   propX: z.string().optional(),
 * })
 *
 * export type ProductFilterProps = z.infer<typeof ProductFilterPropsSchema>
 */
export function extendBaseFilterPropsSchema<T extends ZodRawShape>(schema: T) {
  return BaseFilterPropsSchema.extend(schema)
}
