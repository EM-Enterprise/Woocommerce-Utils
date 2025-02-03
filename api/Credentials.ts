import { validateWoocommerceCredentials, WoocommerceCredentials } from '@/schemas/WoocommerceCredentials'

let credentials: WoocommerceCredentials | undefined = undefined

/**
 * Sets the credentials for the Woocommerce API
 * @param creds The credentials that are to be set
 * @param skipValidation Whether or not to skip the validation of the credentials (used for testing purposes only)
 */
export function setCredentials(creds: WoocommerceCredentials, skipValidation?: boolean) {
  if (skipValidation) {
    //* Used for testing purposes only to bypass validation
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
