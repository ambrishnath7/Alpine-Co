import { useMemo } from "react"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { StripeElementsOptions } from "@stripe/stripe-js"
import { useFetchBasketQuery } from "../basket/basketApi"
import OrderSummary from "../../app/shared/components/OrderSummary"
import CheckoutStepper from "./CheckoutStepper"
import { useAppSelector } from "../../app/store/store"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery()
  const darkMode = useAppSelector(state => state.ui.darkMode)

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined

    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    }
  }, [basket, darkMode])

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        {!stripePromise || !options ? (
          <Typography variant="h6">
            Loading checkout...
          </Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid>

      <Grid item xs={4}>
        <OrderSummary />
      </Grid>
    </Grid>
  )
}