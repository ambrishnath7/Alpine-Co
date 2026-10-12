import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import { Link, useParams } from "react-router-dom"
import { format } from "date-fns"

import { useFetchOrderDetailsQuery } from "./orderApi"
import { currencyFormat, formatAddress, formatPayment } from "../../lib/utilities"

export default function OrderDetailsPage() {
  const { id } = useParams()

  const { data: order, isLoading } = useFetchOrderDetailsQuery(
    Number(id)
  )

  if (isLoading) {
    return (
      <Typography variant="h5">
        Loading order...
      </Typography>
    )
  }

  if (!order) {
    return (
      <Typography variant="h5">
        Order not found
      </Typography>
    )
  }

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 2,
          maxWidth: "md",
          mx: "auto"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography
            variant="h5"
            align="center"
          >
            Order summary for #{order.id}
          </Typography>

          <Button
            component={Link}
            to="/orders"
            variant="outlined"
          >
            Back to orders
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Billing and delivery information
          </Typography>

          <Box component="dl">
            <Typography
              component="dt"
              variant="subtitle1"
              fontWeight={500}
            >
              Shipping address
            </Typography>

            <Typography
              component="dd"
              variant="body2"
              fontWeight={300}
            >
              {formatAddress(order.shippingAddress)}
            </Typography>

            <Typography
              component="dt"
              variant="subtitle1"
              fontWeight={500}
              sx={{ mt: 2 }}
            >
              Payment info
            </Typography>

            <Typography
              component="dd"
              variant="body2"
              fontWeight={300}
            >
              {formatPayment(order.paymentSummary)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Order details
          </Typography>

          <Box component="dl">
            <Typography
              component="dt"
              variant="subtitle1"
              fontWeight={500}
            >
              Email address
            </Typography>

            <Typography
              component="dd"
              variant="body2"
              fontWeight={300}
            >
              {order.buyerEmail}
            </Typography>

            <Typography
              component="dt"
              variant="subtitle1"
              fontWeight={500}
              sx={{ mt: 2 }}
            >
              Order status
            </Typography>

            <Typography
              component="dd"
              variant="body2"
              fontWeight={300}
            >
              {order.orderStatus}
            </Typography>

            <Typography
              component="dt"
              variant="subtitle1"
              fontWeight={500}
              sx={{ mt: 2 }}
            >
              Order date
            </Typography>

            <Typography
              component="dd"
              variant="body2"
              fontWeight={300}
            >
              {format(
                new Date(order.orderDate),
                "dd MMM yyyy"
              )}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <TableContainer>
          <Table>
            <TableBody>
              {order.orderItems.map(item => (
                <TableRow
                  key={item.productId}
                  sx={{
                    borderBottom:
                      "1px solid rgba(224, 224, 224, 1)"
                  }}
                >
                  <TableCell sx={{ py: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                      }}
                    >
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{
                          width: 40,
                          height: 40
                        }}
                      />

                      <Typography>
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ p: 4 }}
                  >
                    x {item.quantity}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ p: 4 }}
                  >
                    {currencyFormat(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: 3
          }}
        >
          <Typography>Subtotal</Typography>
          <Typography>
            {currencyFormat(order.subtotal)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: 3
          }}
        >
          <Typography>Discount</Typography>
          <Typography color="green">
            {currencyFormat(order.discount)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: 3
          }}
        >
          <Typography>Delivery fee</Typography>
          <Typography>
            {currencyFormat(order.deliveryFee)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: 3,
            mt: 1
          }}
        >
          <Typography fontWeight={700}>
            Total
          </Typography>

          <Typography fontWeight={700}>
            {currencyFormat(order.total)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}