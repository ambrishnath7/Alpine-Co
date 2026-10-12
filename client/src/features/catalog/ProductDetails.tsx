import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useFetchProductDetailsQuery } from "./catalogApi"
import {
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useFetchBasketQuery,
} from "../basket/basketApi"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useFetchProductDetailsQuery(+id! || 0)
  const [removeBasketItem] = useRemoveBasketItemMutation()
  const [addBasketItem] = useAddBasketItemMutation()
  const { data: basket } = useFetchBasketQuery()

  const item = basket?.items.find((x) => x.productId === +id!)

  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (item) setQuantity(item.quantity)
  }, [item])

  if (!product || isLoading) return <div>Loading...</div>

  const outOfStock = product.quantityInStock === 0
  const lowStock = product.quantityInStock > 0 && product.quantityInStock <= 5
  const freeDelivery = product.price > 10000

  const updateBasket = async () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity

    if (!item || quantity > item.quantity) {
      await addBasketItem({ product, quantity: updatedQuantity }).unwrap()
    } else {
      await removeBasketItem({
        productId: product.id,
        quantity: updatedQuantity,
      }).unwrap()
    }
  }

  const handleUpdateBasket = async () => {
    try {
      await updateBasket()
    } catch (error) {
      console.log(error)
    }
  }

  const handleBuyNow = async () => {
    try {
      if (!item) {
        await addBasketItem({
          product,
          quantity: quantity > 0 ? quantity : 1,
        }).unwrap()
      } else if (quantity !== item.quantity) {
        await updateBasket()
      }
      navigate("/checkout")
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value

    if (value >= 0 && value <= product.quantityInStock) {
      setQuantity(value)
    }
  }

  const productDetails = [
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in stock", value: product.quantityInStock },
  ]

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      <Button component={Link} to="/catalog" sx={{ mb: 2 }}>
        Back to catalog
      </Button>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <img
              src={product.pictureUrl}
              alt={product.name}
              style={{ width: "100%", display: "block", borderRadius: 8 }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            ${(product.price / 100).toFixed(2)}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: outOfStock
                  ? "error.main"
                  : lowStock
                  ? "warning.main"
                  : "success.main",
              }}
            >
              {outOfStock
                ? "Out of stock"
                : lowStock
                ? `Only ${product.quantityInStock} left`
                : "In stock"}
            </Typography>
            {freeDelivery && (
              <Chip label="Free delivery" size="small" color="success" />
            )}
          </Box>

          <Typography sx={{ mt: 2 }} color="text.secondary">
            {product.description}
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mt: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  variant="outlined"
                  type="number"
                  label="Quantity"
                  fullWidth
                  value={quantity}
                  onChange={handleInputChange}
                  disabled={outOfStock}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  sx={{ height: "55px" }}
                  onClick={handleUpdateBasket}
                  disabled={
                    outOfStock ||
                    quantity === item?.quantity ||
                    (!item && quantity === 0)
                  }
                >
                  {item ? "Update quantity" : "Add to cart"}
                </Button>
              </Grid>
              <Grid size={12}>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  sx={{ height: "55px" }}
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                >
                  Buy now
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer sx={{ mt: 3 }}>
            <Table sx={{ "& td": { fontSize: "1rem" } }}>
              <TableBody>
                {productDetails.map((detail) => (
                  <TableRow key={detail.label}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {detail.label}
                    </TableCell>
                    <TableCell>{detail.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}