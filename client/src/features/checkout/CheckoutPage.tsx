import { useEffect, useMemo, useRef } from "react"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { StripeElementsOptions } from "@stripe/stripe-js"
import { useFetchBasketQuery } from "../basket/basketApi"
import { useCreatePaymentIntentMutation } from "./checkoutApi"
import OrderSummary from "../../app/shared/components/OrderSummary"
import CheckoutStepper from "./CheckoutStepper"
import { useAppSelector } from "../../app/store/store"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery()
  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation()
  const darkMode = useAppSelector(state => state.ui.darkMode)
  const created = useRef(false)

  useEffect(() => {
    if (!created.current && basket?.items?.length && !basket?.clientSecret) {
      created.current = true
      createPaymentIntent()
    }
  }, [basket?.items?.length, basket?.clientSecret, createPaymentIntent])

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined

    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    }
  }, [basket?.clientSecret, darkMode])

  if (basket && basket.items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Your basket is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add some products before proceeding to checkout.
        </Typography>
        <Button variant="contained" component={Link} to="/catalog">
          Go to Catalog
        </Button>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        {!stripePromise || !options ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 6, gap: 2 }}>
            <CircularProgress size={48} />
            <Typography variant="h6">
              {isCreatingIntent ? "Initializing payment session..." : "Loading checkout..."}
            </Typography>
          </Box>
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