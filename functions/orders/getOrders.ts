import { useWoocommerce } from '@/api/useWoocommerce'
import { Order, validateOrders } from '@/schemas/orders/Order'
import { BaseFilterProps, validateBaseFilterProps } from '@/schemas/filters/BaseFilterProps'

export async function getOrders(filterProps: BaseFilterProps = {}): Promise<Order[] | never> {
  const filters = validateBaseFilterProps(filterProps)

  const { get } = useWoocommerce()

  const orders = await get<Order[]>('orders', filters)
  return validateOrders(orders)
}
