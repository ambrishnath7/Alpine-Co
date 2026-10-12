import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import LockOutlineIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import { Link as RouterLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema"
import { useRegisterMutation } from "./accountApi"

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isLoading }
  } = useForm<RegisterSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap()
    } catch (error) {
      const apiError = error as { message?: string }

      if (apiError.message && typeof apiError.message === 'string') {
        const errorArray = apiError.message.split(',')

        errorArray.forEach((e) => {
          if (e.includes('password')) {
            setError('password', { message: e })
          } else if (e.includes('email')) {
            setError('email', { message: e })
          }
        })
      }
    }
  }

  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ marginTop: 8 }}
      >
        <LockOutlineIcon
          sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }}
        />
        <Typography variant="h5">Register</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ my: 3 }}
        >
          <TextField
            fullWidth
            label="Email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button disabled={!isValid || isLoading} type="submit" variant="contained">
            Register
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?
            <Link component={RouterLink} to="/login" color="primary" sx={{ ml: 2 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}