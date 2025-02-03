import { extendApiFilterPropsSchema } from '@/schemas/filters/ApiFilterProps'
import { z } from 'zod'

const ProductFilterPropsSchema = extendApiFilterPropsSchema(
  z.object({
    status: z.enum(['draft', 'pending', 'private', 'publish', 'any']).optional().default('any'),
    include_status: z
      .array(z.enum(['draft', 'pending', 'private', 'publish', 'any']))
      .transform((states) => states.join(','))
      .optional(),
    exclude_status: z
      .array(z.enum(['draft', 'pending', 'private', 'publish', 'any']))
      .transform((states) => states.join(','))
      .optional(),

    type: z.enum(['simple', 'variable', 'grouped', 'external']).optional(),
    include_types: z
      .array(z.enum(['simple', 'variable', 'grouped', 'external']))
      .transform((types) => types.join(','))
      .optional(),
    exclude_types: z
      .array(z.enum(['simple', 'variable', 'grouped', 'external']))
      .transform((types) => types.join(','))
      .optional(),

    sku: z.string().optional(),
    slug: z.string().optional(),
    shipping_class: z.string().optional(),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
  }),
)

export type ProductFilterProps = z.infer<typeof ProductFilterPropsSchema>

/**
 * Validates a given object against the ProductFilterPropsSchema and provides default values for required properties.
 */
export function validateProductFilterProps(object: any) {
  return ProductFilterPropsSchema.parse(object)
}
