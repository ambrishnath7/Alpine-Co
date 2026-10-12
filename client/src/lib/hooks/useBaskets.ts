import { useMemo } from "react"
import {
  useFetchBasketQuery,
  useClearBasketMutation
} from "../../features/basket/basketApi"

export function useBaskets() {
  const { data: basket } = useFetchBasketQuery()

  const [clearBasket] = useClearBasketMutation()

  const subtotal = useMemo(() => {
    return (
      basket?.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) || 0
    )
  }, [basket])

  const deliveryFee = subtotal > 10000 ? 0 : 500

  const total = subtotal + deliveryFee

  return {
    basket,
    subtotal,
    deliveryFee,
    total,
    clearBasket
  }
}