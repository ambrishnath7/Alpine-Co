export function currencyFormat(amount: number) {
  return `$${(amount / 100).toFixed(2)}`
}

import type { Address } from "../app/models/user"
import type { PaymentSummary } from "../app/models/order"

export function formatAddress(address: Address) {
  return `${address.name}, ${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`
}

export function formatPayment(payment: PaymentSummary) {
  return `${payment.brand.toUpperCase()}, **** **** **** ${payment.last4}, exp ${payment.expMonth}/${payment.expYear}`
}