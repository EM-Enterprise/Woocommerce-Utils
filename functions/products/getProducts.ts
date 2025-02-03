import { useWoocommerce } from '@/api/useWoocommerce'
import { Product, validateProducts } from '@/schemas/products/Product'
import { ApiFilterProps, validateApiFilterProps } from '@/schemas/filters/ApiFilterProps'

export async function getProducts(filterProps: ApiFilterProps): Promise<Product[] | never> {
  const filters = validateApiFilterProps(filterProps)
  const { get } = useWoocommerce()

  const products = await get<Product[]>('products', filters)
  return validateProducts(products)
}
