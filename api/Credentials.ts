import { validateWoocommerceCredentials, WoocommerceCredentials } from '@/schemas/WoocommerceCredentials'

let credentials: WoocommerceCredentials | undefined = undefined

export function setCredentials(creds: WoocommerceCredentials, skipValidation?: boolean) {
  if (skipValidation) {
    credentials = creds
    return
  }

  credentials = validateWoocommerceCredentials(creds)
}

export function getCredentials(): WoocommerceCredentials | never {
  if (!credentials) {
    throw new ReferenceError('[Woocommerce-Utils]: Authorization - Credentials not set')
  }

  return validateWoocommerceCredentials(credentials)
}
