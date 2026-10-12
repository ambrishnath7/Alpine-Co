import type { Item } from "../../app/models/basket"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid2"
import IconButton from "@mui/material/IconButton"
import Remove from "@mui/icons-material/Remove"
import Add from "@mui/icons-material/Add"
import Close from "@mui/icons-material/Close"
import { useRemoveBasketItemMutation, useAddBasketItemMutation } from "./basketApi"
import { currencyFormat } from "../../lib/utilities"

type Props = {
  item: Item
}

export default function BasketItem({ item }: Props) {
  const [removeBasketItem] = useRemoveBasketItemMutation()
  const [addBasketItem] = useAddBasketItemMutation()

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        color="error"
        size="small"
        onClick={() => removeBasketItem({ productId: item.productId, quantity: item.quantity })}
        sx={{ border: 1, borderRadius: 1, minWidth: 0, position: 'absolute', top: 0, right: 0, mr: 1, mt: 1 }}
      >
        <Close />
      </IconButton>

      <Paper
        sx={{
          height: 140,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={item.pictureUrl}
            alt={item.name}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4, marginRight: 8, marginLeft: 4 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography sx={{ fontSize: '1.1rem' }}>
                {currencyFormat(item.price)}
              </Typography>
              <Typography sx={{ fontSize: '1.1rem' }} color="primary">
                {currencyFormat(item.price * item.quantity)}
              </Typography>
            </Box>
            <Grid container spacing={1} sx={{ alignItems: 'center' }}>
              <Grid>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removeBasketItem({ productId: item.productId, quantity: 1 })}
                  sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
                >
                  <Remove />
                </IconButton>
              </Grid>
              <Grid>
                <Typography variant="h6">{item.quantity}</Typography>
              </Grid>
              <Grid>
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => addBasketItem({ product: item, quantity: 1 })}
                  sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
                >
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}