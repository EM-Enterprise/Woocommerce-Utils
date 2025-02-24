import { useWoocommerce } from '@/api/useWoocommerce'
import { Order, validateOrders } from '@/schemas/orders/Order'
import { OrderFilterProps, validateOrderFilterProps } from '@/schemas/orders/OrderFilterProps'

export async function getOrders(filterProps: OrderFilterProps = {}): Promise<Order[] | never> {
  const filters = validateOrderFilterProps(filterProps)

  const { get } = useWoocommerce()

  const orders = await get<Order[]>('orders', filters)
  return validateOrders(orders)
}
