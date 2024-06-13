import { Navigate, Route, Routes } from 'react-router-dom';
// =============================================
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
// =============================================
import { rootComponentPaperStyle } from '../../services/styleService';
// =============================================
import MoviesItem from './MoviesItem';
import MoviesList from './MoviesList';

function Movies() {
  return (
    <Box
      sx={{
        m: 2,
      }}
    >
      <Paper elevation={3} sx={rootComponentPaperStyle}>
        <Routes>
          <Route path='/' element={<MoviesList />} />
          <Route path=':id' element={<MoviesItem />} />
          <Route path='new' element={<Navigate to='/movies/new/:id' />} />
        </Routes>
      </Paper>
    </Box>
  );
}

export default Movies;
