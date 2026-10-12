import type { Product } from "../../app/models/product"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { Link } from "react-router-dom"
import { useAddBasketItemMutation } from "../basket/basketApi"

type Props = {
  product: Product
}

function ProductCard({ product }: Props) {
  const [addBasketItem, { isLoading }] = useAddBasketItemMutation()

  const outOfStock = product.quantityInStock === 0
  const lowStock = product.quantityInStock > 0 && product.quantityInStock <= 5
  const freeDelivery = product.price > 10000

  return (
    <Card
      elevation={3}
      sx={{
        width: 280,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
        "&:hover .card-img": { transform: "scale(1.06)" },
      }}
    >
      <Box
        component={Link}
        to={`/catalog/${product.id}`}
        sx={{ display: "block", overflow: "hidden", position: "relative" }}
        aria-label={`View ${product.name}`}
      >
        <CardMedia
          className="card-img"
          sx={{
            height: 240,
            backgroundSize: "cover",
            transition: "transform 0.3s",
          }}
          image={product.pictureUrl}
          title={product.name}
        />
        {freeDelivery && (
          <Chip
            label="Free delivery"
            size="small"
            color="success"
            sx={{ position: "absolute", top: 8, left: 8, fontWeight: 600 }}
          />
        )}
      </Box>

      <CardContent sx={{ pb: 0 }}>
        <Typography
          gutterBottom
          variant="subtitle1"
          sx={{ fontWeight: 600, minHeight: 48 }}
        >
          {product.name}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            minHeight: 20,
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
      </CardContent>

      <CardActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading || outOfStock}
          onClick={() => addBasketItem({ product, quantity: 1 })}
        >
          Add to cart
        </Button>
        <Button component={Link} to={`/catalog/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard