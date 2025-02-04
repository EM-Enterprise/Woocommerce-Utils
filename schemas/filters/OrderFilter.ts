import { extendApiFilterPropsSchema } from '@/schemas/filters/ApiFilterProps'
import { z } from 'zod'

const OrderFilterPropsSchema = extendApiFilterPropsSchema({
  status: z.enum(['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash', 'any']).optional().default('any'),
})

export type OrderFilterProps = z.infer<typeof OrderFilterPropsSchema>

/**
 * Validates a given object against the OrderFilterPropsSchema and provides default values for required properties.
 */
export function validateOrderFilterProps(object: any) {
  return OrderFilterPropsSchema.parse(object)
}
