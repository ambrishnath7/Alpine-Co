import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import DarkMode from "@mui/icons-material/DarkMode"
import LightMode from "@mui/icons-material/LightMode"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Badge from "@mui/material/Badge"
import ShoppingCart from "@mui/icons-material/ShoppingCart"
import Search from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputBase from "@mui/material/InputBase"
import LinearProgress from "@mui/material/LinearProgress"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/store"
import { toggleDarkMode } from "./uiSlice"
import { useFetchBasketQuery } from "../../features/basket/basketApi"
import { useUserInfoQuery } from "../../features/accounts/accountApi"
import { resetParams, setSearchTerm, setTypes } from "../../features/catalog/catalogSlice"
import UserMenu from "./UserMenu"
import logo from "../../assets/logo-icon.png"

const categories = [
  { name: "Boards", icon: "🏂" },
  { name: "Boots", icon: "🥾" },
  { name: "Gloves", icon: "🧤" },
  { name: "Hats", icon: "🧢" },
]

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
]

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "subtitle1",
  fontWeight: 600,
  "&:hover": { color: "grey.500" },
  "&.active": { color: "#baecf9" },
}

function Navbar() {
  const { isLoading, darkMode } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: basket } = useFetchBasketQuery()
  const { data: user } = useUserInfoQuery()
  const [search, setSearch] = useState("")

  const itemCount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSearchTerm(search))
    navigate("/catalog")
  }

  const handleCategory = (type: string) => {
    dispatch(setTypes([type]))
    navigate("/catalog")
  }

  const handleAll = () => {
    dispatch(resetParams())
    setSearch("")
    navigate("/catalog")
  }

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              ...navStyles,
              typography: "h6",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="img" src={logo} alt="" sx={{ height: 38 }} />
            ALPINE CO.
          </Typography>
          <IconButton onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? <DarkMode /> : <LightMode sx={{ color: "yellow" }} />}
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flexGrow: 1,
            maxWidth: 640,
            mx: "auto",
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 2,
            pl: 2,
          }}
        >
          <InputBase
            placeholder="Search for boards, boots, gloves..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, color: "inherit" }}
            inputProps={{ "aria-label": "Search products" }}
          />
          <IconButton type="submit" aria-label="Search" sx={{ color: "inherit" }}>
            <Search />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            aria-label="Basket"
            sx={{ color: "inherit" }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          pb: 1,
          overflowX: "auto",
          bgcolor: "rgba(0,0,0,0.18)",
        }}
      >
        <Button
          color="inherit"
          size="small"
          onClick={handleAll}
          startIcon={<span>🏔️</span>}
        >
          All products
        </Button>
        {categories.map((c) => (
          <Button
            key={c.name}
            color="inherit"
            size="small"
            onClick={() => handleCategory(c.name)}
            startIcon={<span>{c.icon}</span>}
          >
            {c.name}
          </Button>
        ))}
      </Box>

      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  )
}

export default Navbar
