import { useWoocommerce } from '@/api/useWoocommerce'
import { Product, validateProducts } from '@/schemas/products/Product'
import { ProductFilterProps, validateProductFilterProps } from '@/schemas/filters/ProductFilter'

export async function getProducts(filterProps: ProductFilterProps): Promise<Product[] | never> {
  const filters = validateProductFilterProps(filterProps)
  const { get } = useWoocommerce()

  const products = await get<Product[]>('products', filters)
  return validateProducts(products)
}
