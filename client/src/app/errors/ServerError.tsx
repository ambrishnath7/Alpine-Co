import { useLocation } from "react-router-dom"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"

type LocationState = {
  error?: {
    title: string
    detail: string
  }
}

export default function ServerError() {
  const { state } = useLocation() as { state: LocationState }

  return (
    <Container component={Paper}>
      {state?.error ? (
        <>
          <Typography gutterBottom variant="h3" sx={{ px: 4, pt: 2 }} color="secondary">
            {state.error.title}
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ p: 4 }}>
            {state.error.detail}
          </Typography>
        </>
      ) : (
        <Typography gutterBottom variant="h5">Server error</Typography>
      )}
    </Container>
  )
}