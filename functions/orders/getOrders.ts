import { useWoocommerce } from '@/api/useWoocommerce'
import { Order, validateOrders } from '@/schemas/orders/Order'
import { ApiFilterProps, validateApiFilterProps } from '@/schemas/filters/ApiFilterProps'

export async function getOrders(filterProps: ApiFilterProps = {}): Promise<Order[] | never> {
  const filters = validateApiFilterProps(filterProps)

  const { get } = useWoocommerce()

  const orders = await get<Order[]>('orders', filters)
  return validateOrders(orders)
}
