import type { Address } from "./user"

export interface Order {
  id: number
  buyerEmail: string
  shippingAddress: Address
  orderDate: string
  orderItems: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  orderStatus: string
  paymentSummary: PaymentSummary
}

export interface OrderItem {
  productId: number
  name: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface PaymentSummary {
  last4: number | string
  brand: string
  expMonth: number
  expYear: number
}

export interface CreateOrder {
  shippingAddress: Address
  paymentSummary: PaymentSummary
}