import { useMemo } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { Link, useLocation } from "react-router-dom"
import { useFetchBasketQuery } from "../../../features/basket/basketApi"
import { currencyFormat } from "../../../lib/utilities"

export default function OrderSummary() {
  const { data: basket } = useFetchBasketQuery()
  const location = useLocation()

  const subtotal = useMemo(() => {
    return basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  }, [basket])

  const deliveryFee = subtotal > 10000 ? 0 : 500

  const total = subtotal + deliveryFee

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Order summary</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Orders over $100 qualify for free delivery
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>{currencyFormat(subtotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Delivery fee</Typography>
          <Typography>{currencyFormat(deliveryFee)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{currencyFormat(total)}</Typography>
        </Box>

        {!location.pathname.includes('checkout') && (
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            fullWidth
            size="large"
          >
            Checkout
          </Button>
        )}

        <Button component={Link} to="/catalog" fullWidth sx={{ mt: 1 }}>
          Continue shopping
        </Button>
      </Paper>
    </Box>
  )
}