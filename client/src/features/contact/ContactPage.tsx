import Typography from "@mui/material/Typography"
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import { increment, decrement } from "./counterReducer"
import { useAppDispatch, useAppSelector } from "../../app/store/store"

export default function ContactPage() {
  const data = useAppSelector(state => state.counter.data)
  const dispatch = useAppDispatch()

  return (
    <>
      <Typography variant="h2">Contact page</Typography>
      <Typography variant="body1">The data is: {data}</Typography>
      <ButtonGroup>
        <Button color="error" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button color="secondary" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
        <Button color="primary" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  )
}