import { z } from 'zod'
import { useSchema } from '@/schemas/utils/useSchema'

const stringDate = z.string().transform((date_string) => new Date(date_string))
const stringedNumber = z.string().transform((val) => parseFloat(val))

const emptyStringNullTransformation = z.string().transform((val) => (val.trim().length === 0 ? null : val))

const meta_data_schema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.any(),
})

const billing_schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  title_formatted: emptyStringNullTransformation,
  company: emptyStringNullTransformation,
  address_1: emptyStringNullTransformation,
  address_2: emptyStringNullTransformation,
  city: emptyStringNullTransformation,
  state: emptyStringNullTransformation,
  postcode: z.string(),
  country: z.string(),
  email: emptyStringNullTransformation,
  phone: emptyStringNullTransformation,
})

const shipping_schema = z.object({
  title_formatted: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  company: emptyStringNullTransformation,
  address_1: z.string(),
  address_2: emptyStringNullTransformation,
  city: z.string(),
  state: emptyStringNullTransformation,
  postcode: z.string(),
  country: z.string(),
})

const tax_lines_schema = z.object({
  id: z.number(),
  rate_code: z.string().optional(),
  rate_id: z.number().optional(),
  label: z.string().optional(),
  compound: z.boolean().optional(),
  tax_total: stringedNumber.optional(),
  shipping_tax_total: stringedNumber.optional(),
  meta_data: z.array(meta_data_schema).optional(),
})

const line_items_schema = z.object({
  id: z.number(),
  name: z.string(),
  product_id: z.number(),
  variation_id: z.number(),
  quantity: z.number(),

  tax_class: stringedNumber,
  subtotal: stringedNumber,
  subtotal_tax: stringedNumber,
  total: stringedNumber,
  total_tax: stringedNumber,
  taxes: z.array(tax_lines_schema),
  meta_data: z.array(meta_data_schema),
  sku: z.string(),
  price: z.number(),
})

const shipping_lines_schema = z.object({
  id: z.number(),
  method_title: z.string(),
  method_id: z.string(),
  total: stringedNumber,
  total_tax: stringedNumber,
  taxes: z.array(tax_lines_schema),
  meta_data: z.array(meta_data_schema),
})

const fee_lines_schema = z.object({
  id: z.number(),
  name: z.string(),
  tax_class: z.string(),
  tax_status: z.string(),
  total: z.string(),
  total_tax: z.string(),
  taxes: z.array(tax_lines_schema),
  meta_data: z.array(meta_data_schema),
})

const coupon_lines_schema = z.object({
  id: z.number(),
  code: z.string(),
  discount: z.string(),
  discount_tax: z.string(),
  meta_data: z.array(meta_data_schema),
})

const refunds_schema = z.object({
  id: z.number(),
  refund: z.string().optional(),
  total: z.string(),
})

const shipments_schema = z.object({
  id: z.number(),
  date_created: stringDate,
  date_sent: stringDate.nullable(),
  est_delivery_date: stringDate.nullable(),

  total: stringedNumber,
  subtotal: stringedNumber,
  additional_total: stringedNumber,

  order_id: z.number(),
  weight: stringedNumber,
  weight_unit: z.string(),
  tracking_id: z.string(),
  tracking_url: z.string(),
  tracking_provider: z.string().optional(),

  status: z.enum(['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash']).catch('pending'),
})

export const OrderSchema = z
  .object({
    id: z.number().default(10),
    number: z
      .string()
      .transform((val) => parseFloat(val))
      .default('10'),
    status: z.enum(['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash']).catch('pending'),
    currency: z.enum(['USD', 'EUR', 'GBP']).catch('USD'),
    date_created: stringDate.default(new Date().toLocaleDateString('de')),
    date_modified: stringDate.default(new Date().toLocaleDateString('de')),
    date_paid: stringDate.nullable().default(new Date().toLocaleDateString('de')),
    date_completed: stringDate.nullable().default(new Date().toLocaleDateString('de')),

    discount_total: stringedNumber.default('0.0'),
    discount_tax: stringedNumber.default('0.0'),
    shipping_total: stringedNumber.default('0.0'),
    shipping_tax: stringedNumber.default('0.0'),
    total: stringedNumber.default('0.0'),
    total_tax: stringedNumber.default('0.0'),

    customer_id: z.number().catch(0),
    customer_note: emptyStringNullTransformation.default(''),

    payment_method: z.string().default('paypal'),
    payment_method_title: z.string().default('PayPal'),

    billing: billing_schema,

    shipping: shipping_schema,
    shipments: z.array(shipments_schema),
    shipping_status: z.enum(['not-shipped', 'shipped', 'delivered', 'no-shipping-needed']).default('not-shipped'),
    shipping_provider: z.string(),

    meta_data: z.array(meta_data_schema),
    line_items: z.array(line_items_schema),
    tax_lines: z.array(tax_lines_schema),
    shipping_lines: z.array(shipping_lines_schema),
    fee_lines: z.array(fee_lines_schema),
    coupon_lines: z.array(coupon_lines_schema),
    refunds: z.array(refunds_schema),
  })
  .transform(({ line_items, ...rest }) => ({ ...rest, items: line_items }))

export type Order = z.infer<typeof OrderSchema>

const { validateObject: validateOrder, getDummyObject: getDummyOrder, safeParseObject: safeParseOrder } = useSchema<Order>(OrderSchema)
export { validateOrder, getDummyOrder, safeParseOrder }

const OrdersSchema = z.array(OrderSchema)
export type Orders = z.infer<typeof OrdersSchema>

const { validateObject: validateOrders, getDummyObject: getDummyOrders, safeParseObject: safeParseOrders } = useSchema<Orders>(OrdersSchema)
export { validateOrders, getDummyOrders, safeParseOrders }
