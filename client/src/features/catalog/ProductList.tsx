import type { Product } from "../../app/models/product"
import Grid from "@mui/material/Grid2"
import ProductCard from "./ProductCard"

type Props = {
  products: Product[]
}

function ProductList({ products }: Props) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={3} sx={{ display: 'flex' }} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductList