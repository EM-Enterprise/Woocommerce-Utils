import { z } from 'zod'
import { useSchema } from '@/schemas/utils/useSchema'

const dateString = z.union([z.string(), z.date()]).transform((val) => (typeof val === 'object' ? val : new Date(val)))
const stringToNumber = z.union([z.string(), z.number(), z.null()]).transform((val) => (val != null && val.toString().trim().length > 0 ? parseFloat(val.toString()) : null))

const ProductVariationSchema = z.object({
  id: z.number(),
  name: z.string(),
  date_created: dateString,
  date_modified: dateString,
  description: z.string(),
  permalink: z.string(),
  sku: z.string(),

  price: stringToNumber,
  regular_price: stringToNumber,
  sale_price: stringToNumber.nullable(),

  on_sale: z.boolean().default(false),
  date_on_sale_from: dateString.nullable(),
  date_on_sale_to: dateString.nullable(),

  status: z.enum(['publish', 'private', 'draft', 'trash']).default('publish'),
  purchasable: z.boolean(),
  tax_status: z.enum(['taxable', 'shipping', 'none']).default('taxable'),
  tax_class: z.string().optional(),

  manage_stock: z
    .union([z.string(), z.boolean()])
    .transform((val) => Boolean(val))
    .default(false),
  stock_quantity: z.number().nullable(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).default('instock'),
  backorders: z.enum(['no', 'notify', 'yes']).default('no'),
  backorders_allowed: z.boolean().default(false),

  weight: stringToNumber.optional(),
  dimensions: z.object({
    length: stringToNumber.nullable(),
    width: stringToNumber.nullable(),
    height: stringToNumber.nullable(),
  }),

  shipping_class: z.string().optional(),
  shipping_class_id: z.number().optional(),
  meta_data: z
    .array(
      z.object({
        id: z.number(),
        key: z.string(),
        value: z.any(),
      }),
    )
    .default([]),
  attributes: z
    .array(
      z
        .object({
          id: z.number(),
          name: z.string(),
          slug: z.string().optional(),
          option: z.string().optional(),
        })
        .passthrough(),
    )
    .default([]),
})

export type ProductVariation = z.infer<typeof ProductVariationSchema>

const { validateObject: validateProductVariation, getDummyObject: getDummyProductVariation, safeParseObject: safeParseProductVariation } = useSchema<ProductVariation>(ProductVariationSchema)
export { validateProductVariation, getDummyProductVariation, safeParseProductVariation }

const ProductVariationsSchema = z.array(ProductVariationSchema)
export type ProductVariations = z.infer<typeof ProductVariationsSchema>

const { validateObject: validateProductVariations, getDummyObject: getDummyProductVariations, safeParseObject: safeParseProductVariations } = useSchema<ProductVariations>(ProductVariationsSchema)
export { validateProductVariations, getDummyProductVariations, safeParseProductVariations }
