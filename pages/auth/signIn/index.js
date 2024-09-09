import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import CircularIndeterminate from '@/src/components/Loading'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ©, '}
      <Link color="inherit" href="https://telkomuniversity.ac.id/">
        Telkom University
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const username = React.useRef('');
  const password = React.useRef('');
  const [isLoading, SetIsLoading] = React.useState(false);

  async function handleSubmit() {
    SetIsLoading(true)
    const result = await signIn("credentials", {
      username: username.current,
      password: password.current,
      redirect: true,
      callbackUrl: '/'
    })
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >            
            <Typography component="h1" variant="h5" sx={{textAlign: 'center'}}>
              Selamat Datang di AGROSMARTSYSTEM.ID
            </Typography>
            <Image src={'/logo.png'} alt='' width={120} height={0} className='my-4' />
            <Typography component="h6" variant="h6">
              Silahkan Login Ke Akun Anda
            </Typography>
            <Box noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nama Pengguna"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => (username.current = e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Kata Sandi"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => (password.current = e.target.value)}
              />
              <button className={`h-12 w-full my-4 font-medium flex justify-center items-center bg-sky-700 text-white rounded ${isLoading ? 'cursor-not-allowed' : ''}`} onClick={handleSubmit}>
                { isLoading ? (<CircularIndeterminate/>) : 'Login' }
              </button>
              <Grid container>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}