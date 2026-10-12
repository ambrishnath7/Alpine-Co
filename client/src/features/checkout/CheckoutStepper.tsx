import { useState } from "react"
import Paper from "@mui/material/Paper"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography"
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js"
import type { ConfirmationToken } from "@stripe/stripe-js"
import { useStripe, useElements } from "@stripe/react-stripe-js"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingButton from "@mui/lab/LoadingButton"

import { useFetchAddressQuery } from "../accounts/accountApi"
import { useBaskets } from "../../lib/hooks/useBaskets"
import { currencyFormat } from "../../lib/utilities"
import Review from "./Review"
import { useCreateOrderMutation } from "../orders/orderApi"

const steps = ["Address", "Payment", "Review"]

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0)

  const [addressComplete, setAddressComplete] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const [confirmationToken, setConfirmationToken] =
    useState<ConfirmationToken | null>(null)

  const [submitting, setSubmitting] = useState(false)

  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const { basket, total, clearBasket } = useBaskets()

  const [createOrder] = useCreateOrderMutation()

  const { data, isLoading } = useFetchAddressQuery()

  let name, restAddress

  if (data) {
    ({ name, ...restAddress } = data)
  }

  const handleAddressChange = (event: { complete: boolean }) => {
    setAddressComplete(event.complete)
  }

  const handlePaymentChange = (event: { complete: boolean }) => {
    setPaymentComplete(event.complete)
  }

  const createOrderModel = () => {
    const shippingAddress = confirmationToken?.shipping
    const paymentSummary =
      confirmationToken?.payment_method_preview?.card

    if (!shippingAddress || !shippingAddress.address || !paymentSummary) {
      throw new Error("Problem creating order")
    }

    return {
      shippingAddress: {
        name: shippingAddress.name ?? "",
        line1: shippingAddress.address.line1 ?? "",
        line2: shippingAddress.address.line2,
        city: shippingAddress.address.city ?? "",
        state: shippingAddress.address.state ?? "",
        postal_code: shippingAddress.address.postal_code ?? "",
        country: shippingAddress.address.country ?? ""
      },

      paymentSummary: {
        last4: paymentSummary.last4,
        brand: paymentSummary.brand,
        expMonth: paymentSummary.exp_month,
        expYear: paymentSummary.exp_year
      }
    }
  }

  const confirmPayment = async () => {
    setSubmitting(true)

    try {
      if (!confirmationToken || !basket || !stripe) {
        throw new Error("Unable to process payment")
      }

      if (!basket.clientSecret) {
        throw new Error("Unable to process payment")
      }

      const orderModel = createOrderModel()

      const orderResult = await createOrder(orderModel).unwrap()

      const paymentResult = await stripe.confirmPayment({
        clientSecret: basket.clientSecret,
        redirect: "if_required",
        confirmParams: {
          confirmation_token: confirmationToken.id
        }
      })

      if (paymentResult.paymentIntent) {
        if (paymentResult.paymentIntent.status === "succeeded") {
          navigate("/checkout/success", {
            state: orderResult
          })

          clearBasket()
        } else {
          throw new Error("Payment was not successful")
        }
      } else if (paymentResult.error) {
        throw new Error(paymentResult.error.message)
      } else {
        throw new Error("Something went wrong")
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }

      setActiveStep(step => step - 1)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (activeStep === 1) {
      if (!stripe || !elements) {
        toast.error("Stripe is not ready")
        return
      }

      const result = await elements.submit()

      if (result.error) {
        toast.error(result.error.message)
        return
      }

      const stripeResult = await stripe.createConfirmationToken({
        elements
      })

      if (stripeResult.error) {
        toast.error(stripeResult.error.message)
        return
      }

      setConfirmationToken(stripeResult.confirmationToken)
    }

    if (activeStep === 2) {
      await confirmPayment()
      return
    }

    if (activeStep < 2) {
      setActiveStep(step => step + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(step => step - 1)
  }

  if (isLoading) {
    return (
      <Typography variant="h6">
        Loading checkout...
      </Typography>
    )
  }

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: activeStep === 0 ? "block" : "none"
            }}
          >
            <AddressElement
              options={{
                mode: "shipping",
                defaultValues: {
                  name,
                  address: restAddress
                }
              }}
              onChange={handleAddressChange}
            />

            <FormControlLabel
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}
              control={<Checkbox />}
              label="Save as default address"
            />
          </Box>

          <Box
            sx={{
              display: activeStep === 1 ? "block" : "none"
            }}
          >
            <PaymentElement
              onChange={handlePaymentChange}
              options={{
                wallets: {
                  applePay: "never",
                  googlePay: "never"
                }
              }}
            />
          </Box>

          <Box
            sx={{
              display: activeStep === 2 ? "block" : "none"
            }}
          >
            <Review
              confirmationToken={confirmationToken}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          pt: 2,
          justifyContent: "space-between"
        }}
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || submitting}
        >
          Back
        </Button>

        <LoadingButton
          onClick={handleNext}
          loading={submitting}
          disabled={
            (activeStep === 0 && !addressComplete) ||
            (activeStep === 1 && !paymentComplete)
          }
          variant="contained"
        >
          {activeStep === steps.length - 1
            ? `Pay ${currencyFormat(total)}`
            : "Next"}
        </LoadingButton>
      </Box>
    </>
  )
}