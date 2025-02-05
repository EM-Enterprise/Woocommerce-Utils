import { useWoocommerce } from '@/api/useWoocommerce'
import { Product, validateProduct, validateProducts } from '@/schemas/products/Product'
import { ProductFilterProps, validateProductFilterProps } from '@/schemas/filters/ProductFilter'
import { ProductVariation, validateProductVariations } from '@/schemas/products/ProductVariation'

export async function getProducts(filterProps: ProductFilterProps): Promise<Product[] | never> {
  const filters = validateProductFilterProps(filterProps)
  const { get } = useWoocommerce()

  let products = await get<Product[]>('products', filters)

  // collect product variations and add them to the products array
  products = await collectVariations(products)

  return validateProducts(products)
}

/**
 * Collects all variations for every variable product in the products array and adds them to the products array, while removing the variable parent products, as they add no value.
 * @param products The products array to collect variations for.
 * @returns Returns the products array with all variations added.
 */
async function collectVariations(products: Product[]): Promise<Product[]> {
  const variableProducts = products.filter((p) => p.type === 'variable')

  const promises = variableProducts.map((variableParentProduct, i) =>
    getProductVariations(variableParentProduct.id).then((variations): Product[] => {
      return [
        ...variations.map((variation) => {
          variableParentProduct.variations = []
          variation.name = `${variableParentProduct.name} - ${variation.name}`

          return validateProduct(Object.assign(Object.create(variableParentProduct), variation))
        }),
      ]
    }),
  )

  const productVariations = await Promise.all(promises)

  return [...products.filter((p) => p.type !== 'variable'), ...productVariations.flat()]
}

/**
 * Fetches all variations for a given variable product.
 * @param parentId The id of the variable product to fetch variations for.
 */
async function getProductVariations(parentId: Product['id']): Promise<ProductVariation[] | never> {
  const { get } = useWoocommerce()

  const variations = await get<ProductVariation[]>(`products/${parentId}/variations`)
  return validateProductVariations(variations)
}
