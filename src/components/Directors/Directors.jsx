import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// =============================================
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
// =============================================
import { rootComponentPaperStyle } from '../../services/styleService';
// =============================================
import DirectorsItem from './DirectorsItem';
import DirectorsList from './DirectorsList';

function Directors() {
  const location = useLocation();
  const applyPaperStyles =
    !location.pathname.includes('/edit') && !location.pathname.includes('/new');

  return (
    <Box
      sx={{
        m: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={applyPaperStyles ? rootComponentPaperStyle : undefined}
      >
        <Routes>
          <Route path='/' element={<DirectorsList />} />
          <Route path=':id' element={<DirectorsItem />} />
          <Route path='new' element={<Navigate to='/directors/new/:id' />} />
          <Route path='edit' element={<Navigate to='/directors/edit/:id' />} />
        </Routes>
      </Paper>
    </Box>
  );
}

export default Directors;
