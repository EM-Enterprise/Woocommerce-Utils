import { z } from 'zod'
import { useSchema } from '@/schemas/utils/useSchema'

const dateString = z.string().transform((val) => new Date(val))
const emptyStringToNull = z.string().transform((val) => (val === '' ? null : val))
const stringToNumber = z.string().transform((val) => parseFloat(val))

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  permalink: z.string(),
  date_created: dateString,
  date_modified: dateString,
  type: z.enum(['simple', 'variable', 'grouped', 'external']).default('simple'),
  description: emptyStringToNull.default(''),
  short_description: emptyStringToNull.default(''),
  sku: z.string().optional(),
  price: stringToNumber,
  sale_price: stringToNumber.optional(),
  regular_price: stringToNumber,
  weight: stringToNumber.optional(),
  dimensions: z
    .object({
      length: stringToNumber.optional(),
      width: stringToNumber.optional(),
      height: stringToNumber.optional(),
    })
    .optional(),
  tax_status: z.enum(['taxable', 'shipping', 'none']).default('taxable'),
  tax_class: z.string().optional(),

  status: z.enum(['publish', 'private', 'draft', 'trash']).default('publish'),
  featured: z.boolean().default(false),
  catalog_visibility: z.enum(['visible', 'catalog', 'search', 'hidden']).default('visible'),

  on_sale: z.boolean().default(false),
  date_on_sale_from: dateString.optional(),
  date_on_sale_to: dateString.optional(),

  manage_stock: z.boolean().default(false),
  stock_quantity: z.number().optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).default('instock'),
  backorders: z.enum(['no', 'notify', 'yes']).default('no'),
  backorders_allowed: z.boolean().default(false),

  shipping_required: z.boolean(),
  shipping_taxable: z.boolean(),
  shipping_class: z.string().optional(),
  shipping_class_id: z.number().optional(),

  rating_count: z.number().default(0),
  average_rating: stringToNumber,

  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      }),
    )
    .default([]),

  images: z
    .array(
      z.object({
        id: z.number(),
        src: z.string(),
        name: z.string(),
        alt: z.string().optional(),
        date_created: dateString,
        date_modified: dateString,
      }),
    )
    .default([]),

  variations: z.array(z.number()).default([]),
  attributes: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        position: z.number(),
        visible: z.boolean(),
        variation: z.boolean().default(false),
        options: z.array(z.string()),
      }),
    )
    .default([]),

  default_attributes: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        option: z.string(),
      }),
    )
    .default([]),
})

export type Product = z.infer<typeof ProductSchema>

const { validateObject: validateProduct, getDummyObject: getDummyProduct, safeParseObject: safeParseProduct } = useSchema<Product>(ProductSchema)
export { validateProduct, getDummyProduct, safeParseProduct }
