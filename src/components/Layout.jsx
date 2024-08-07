import { Outlet } from 'react-router-dom';
// =============================================
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// =============================================
import { ThemeProvider } from '../contexts/ThemeContext';
// =============================================
import Header from './Header/Header';
import NavBar from './Navigation/NavBar';
import CinemaService from './Service/CinemaService';
import Footer from './Footer/Footer';

function Layout() {
  return (
    <ThemeProvider>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Grid
          container
          direction={'column'}
          sx={{
            flexGrow: 1,
            color: 'text.primary',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[700],
          }}
        >
          <Grid item xs={12}>
            <Header />
          </Grid>
          <Grid container sx={{ mt: '1rem', mb: '1rem', flex: 1 }}>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <NavBar />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Outlet />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <CinemaService />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Footer />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;
