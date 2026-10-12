import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { useFetchProductsQuery } from "../catalog/catalogApi"
import { setTypes } from "../catalog/catalogSlice"
import ProductCard from "../catalog/ProductCard"
import type { Product } from "../../app/models/product"
import heroImg from "../../assets/hero-mountain.jpg"

// Prices are assumed to be stored in cents ($50 = 5000). Change if yours are in dollars.
const UNDER_50_LIMIT = 5000

const primaryBtn = {
  backgroundImage: "linear-gradient(to right, #2563EB, #06B6D4)",
  color: "white",
  fontWeight: "bold",
  borderRadius: "999px",
  px: 3.5,
  py: 1,
}

type PromoProps = {
  type: string
  tagline: string
  tone: "dark" | "light"
  tall?: boolean
}

// One Apple-style promo tile: centered title, tagline, two buttons, product image below.
function PromoTile({ type, tagline, tone, tall }: PromoProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const baseParams = useAppSelector((state) => state.catalog)

  const { data } = useFetchProductsQuery({
    ...baseParams,
    pageNumber: 1,
    pageSize: 1,
    orderBy: "priceDesc",
    searchTerm: "",
    brands: [],
    types: [type],
  })

  const product = data?.items[0]
  const dark = tone === "dark"

  const shop = () => {
    dispatch(setTypes([type]))
    navigate("/catalog")
  }

  return (
    <Box
      sx={{
        bgcolor: dark ? "#0B1220" : "#EAF2FA",
        color: dark ? "white" : "#14213D",
        borderRadius: "16px",
        textAlign: "center",
        pt: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ fontSize: { xs: "2rem", md: tall ? "3.2rem" : "2.4rem" } }}
      >
        {type}
      </Typography>
      <Typography
        variant="h6"
        sx={{ mt: 1, opacity: 0.85, fontWeight: 400 }}
      >
        {tagline}
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="contained" onClick={shop} sx={primaryBtn}>
          Shop {type.toLowerCase()}
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/catalog"
          sx={{
            borderRadius: "999px",
            px: 3.5,
            py: 1,
            color: dark ? "#7DD3FC" : "#2563EB",
            borderColor: dark ? "#7DD3FC" : "#2563EB",
          }}
        >
          Browse all
        </Button>
      </Box>

      <Box
        sx={{
          mt: 4,
          width: "100%",
          height: { xs: 260, md: tall ? 420 : 320 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 3,
        }}
      >
        {product && (
          <Box
            component="img"
            src={product.pictureUrl}
            alt={product.name}
            sx={{ maxHeight: "100%", maxWidth: "85%", objectFit: "contain" }}
          />
        )}
      </Box>
    </Box>
  )
}

type RowProps = {
  title: string
  products: Product[] | undefined
}

function ProductRow({ title, products }: RowProps) {
  if (!products || products.length === 0) return null

  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Button component={Link} to="/catalog">
          See all
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2 }}>
        {products.map((product) => (
          <Box key={product.id} sx={{ flexShrink: 0 }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function HomePage() {
  const baseParams = useAppSelector((state) => state.catalog)

  const { data: topPicks } = useFetchProductsQuery({
    ...baseParams,
    pageNumber: 1,
    pageSize: 8,
    orderBy: "priceDesc",
    searchTerm: "",
    brands: [],
    types: [],
  })

  const { data: affordable } = useFetchProductsQuery({
    ...baseParams,
    pageNumber: 1,
    pageSize: 20,
    orderBy: "price",
    searchTerm: "",
    brands: [],
    types: [],
  })

  const under50 = affordable?.items
    .filter((p) => p.price < UNDER_50_LIMIT)
    .slice(0, 8)

  return (
    <Box sx={{ maxWidth: "xl", mx: "auto", px: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 420, md: 560 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={heroImg}
            alt="Snow-capped mountains above a blue lake"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,18,40,0.35) 0%, rgba(10,18,40,0.65) 100%)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: { xs: 3, md: 8 },
            }}
          >
            <Typography
              variant="h2"
              color="white"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: { xs: "2.2rem", md: "3.5rem" } }}
            >
              Gear for the mountain
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 560, mb: 4 }}
            >
              Boards, boots, gloves and hats. Free delivery on orders over $100.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Button variant="contained" size="large" component={Link} to="/catalog" sx={{ ...primaryBtn, px: 5, py: 1.4 }}>
                Shop now
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/catalog"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.7)",
                  borderRadius: "999px",
                  px: 5,
                  py: 1.4,
                }}
              >
                Browse catalog
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Full-width category tiles */}
        <PromoTile type="Boards" tagline="Ride further." tone="dark" tall />
        <PromoTile type="Boots" tagline="Built for every step." tone="light" tall />

        {/* Two-column category tiles */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          <PromoTile type="Gloves" tagline="Warm hands, steady grip." tone="dark" />
          <PromoTile type="Hats" tagline="Cover up. Stand out." tone="light" />
        </Box>
      </Box>

      <ProductRow title="Top picks" products={topPicks?.items.slice(0, 8)} />
      <ProductRow title="Under $50" products={under50} />
    </Box>
  )
}
