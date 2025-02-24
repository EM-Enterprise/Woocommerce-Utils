import * as functions from '@/functions/_exports'
import { setCredentials } from '@/api/Credentials'
import { WoocommerceCredentials } from '@/schemas/WoocommerceCredentials'

type FunctionsType = typeof functions

interface Woocommerce extends FunctionsType {}

class Woocommerce {
  constructor(credentials: WoocommerceCredentials) {
    setCredentials(credentials)

    Object.assign(this, functions)
  }
}

export = Woocommerce
