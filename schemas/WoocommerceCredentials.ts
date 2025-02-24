import { z } from 'zod'

const WoocommerceCredentialsSchema = z.object({
  url: z.string().refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
    message: 'Please enter a valid URL',
  }),
  consumerKey: z.string().startsWith('ck_', { message: 'consumerKey must start with "ck_"' }).min(10, { message: 'consumerKey must be at least 10 characters long' }),
  consumerSecret: z.string().startsWith('cs_', { message: 'consumerSecret must start with "cs_"' }).min(10, { message: 'consumerSecret must be at least 10 characters long' }),
  version: z.enum(['wc/v3', 'wc/v2', 'wc/v1', 'wc-api/v3', 'wc-api/v2', 'wc-api/v1']).optional(),
})

export type WoocommerceCredentials = z.infer<typeof WoocommerceCredentialsSchema>

/**
 * Validates the given object against the WoocommerceCredentials schema and provides default values for missing properties
 * @internal
 */
export function validateWoocommerceCredentials(object: any) {
  return WoocommerceCredentialsSchema.parse(object)
}
