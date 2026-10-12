import { useState } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Fade from "@mui/material/Fade"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import PersonIcon from "@mui/icons-material/Person"
import HistoryIcon from "@mui/icons-material/History"
import InventoryIcon from "@mui/icons-material/Inventory"
import LogoutIcon from "@mui/icons-material/Logout"
import Divider from "@mui/material/Divider"
import { Link } from "react-router-dom"
import type { User } from "../models/user"
import { useLogoutMutation } from "../../features/accounts/accountApi"

type Props = {
  user: User
}

export default function UserMenu({ user }: Props) {
  const [logout] = useLogoutMutation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button onClick={handleClick}>
        {user.email}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My profile</ListItemText>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/orders"
          onClick={handleClose}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My orders</ListItemText>
        </MenuItem>

        {user.roles.includes("Admin") && (
          <MenuItem
            component={Link}
            to="/inventory"
            onClick={handleClose}
          >
            <ListItemIcon>
              <InventoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Inventory</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}