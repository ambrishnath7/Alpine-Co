import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import LockOutlineIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema"
import { useLoginMutation, useLazyUserInfoQuery } from "./accountApi"

export default function LoginForm() {
  const [login, { isLoading }] = useLoginMutation()
  const [fetchUserInfo] = useLazyUserInfoQuery()
  const navigate = useNavigate()
  const location = useLocation()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap()
      await fetchUserInfo()
      navigate(location.state?.from || '/catalog')
    } catch (error) {
      console.log(error)
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
        <Typography variant="h5">Sign in</Typography>
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
          <Button disabled={isLoading} type="submit" variant="contained">
            Sign in
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?
            <Link component={RouterLink} to="/register" color="primary" sx={{ ml: 2 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}