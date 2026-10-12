import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Link, useLocation } from "react-router-dom"

import type { Order } from "../../app/models/order"
import {
  currencyFormat,
  formatAddress,
  formatPayment
} from "../../lib/utilities"

export default function CheckoutSuccess() {
  const { state } = useLocation()
  const order = state as Order

  if (!order) {
    return (
      <Typography variant="h6">
        Problem accessing the order
      </Typography>
    )
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
      >
        Thanks for your fake order!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        Your order{" "}
        <strong>#{order.id}</strong> will never be processed as this is a fake shop.
      </Typography>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Order date
          </Typography>

          <Typography
            variant="body2"
            fontWeight="bold"
          >
            {order.orderDate}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Payment method
          </Typography>

          <Typography
            variant="body2"
            fontWeight="bold"
          >
            {formatPayment(order.paymentSummary)}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Shipping address
          </Typography>

          <Typography
            variant="body2"
            fontWeight="bold"
          >
            {formatAddress(order.shippingAddress)}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Amount
          </Typography>

          <Typography
            variant="body2"
            fontWeight="bold"
          >
            {currencyFormat(order.total)}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 2
        }}
      >
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/orders/${order.id}`}
        >
          View your order
        </Button>

        <Button
          component={Link}
          to="/catalog"
          variant="outlined"
          color="primary"
        >
          Continue shopping
        </Button>
      </Box>
    </Container>
  )
}