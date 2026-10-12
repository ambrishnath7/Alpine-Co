import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../app/store/store"
import { setTypes } from "../catalog/catalogSlice"

const categories = [
  { name: "Boards", symbol: "🏂" },
  { name: "Boots", symbol: "🥾" },
  { name: "Gloves", symbol: "🧤" },
  { name: "Hats", symbol: "🧢" },
]

export default function CategoryTiles() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClick = (name: string) => {
    dispatch(setTypes([name]))
    navigate("/catalog")
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 2, md: 6 },
        flexWrap: "wrap",
        mt: 5,
      }}
    >
      {categories.map(({ name, symbol }) => (
        <Box
          key={name}
          component="button"
          onClick={() => handleClick(name)}
          aria-label={`Shop ${name}`}
          sx={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            "&:hover .tile": { transform: "translateY(-4px)", boxShadow: 6 },
            "&:focus-visible .tile": { outline: "3px solid #baecf9" },
          }}
        >
          <Box
            className="tile"
            sx={{
              width: { xs: 76, md: 100 },
              height: { xs: 76, md: 100 },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: { xs: 36, md: 48 },
              bgcolor: "background.paper",
              boxShadow: 2,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {symbol}
          </Box>
          <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
        </Box>
      ))}
    </Box>
  )
}