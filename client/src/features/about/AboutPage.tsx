import { useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery
} from "./errorApi"

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [trigger400Error] = useLazyGet400ErrorQuery()
  const [trigger401Error] = useLazyGet401ErrorQuery()
  const [trigger404Error] = useLazyGet404ErrorQuery()
  const [trigger500Error] = useLazyGet500ErrorQuery()
  const [triggerValidationError] = useLazyGetValidationErrorQuery()

  async function getValidationError() {
    try {
      await triggerValidationError().unwrap()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error
        && typeof (error as { message: unknown }).message === 'string') {
        const errorArray = (error as { message: string }).message.split(', ')
        setValidationErrors(errorArray)
      }
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography gutterBottom variant="h3">Errors for testing</Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() => trigger400Error().catch(error => console.log(error))}
        >
          Test 400 error
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger401Error().catch(error => console.log(error))}
        >
          Test 401 error
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger404Error().catch(error => console.log(error))}
        >
          Test 404 error
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger500Error().catch(error => console.log(error))}
        >
          Test 500 error
        </Button>
        <Button
          variant="contained"
          onClick={getValidationError}
        >
          Test validation error
        </Button>
      </ButtonGroup>

      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation errors</AlertTitle>
          <List>
            {validationErrors.map(error => (
              <ListItem key={error}>{error}</ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  )
}