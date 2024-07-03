import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
// =============================================
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// =============================================
import {
  scrollItemBoxStyle,
  buttonMainStyle,
  itemComponentBoxMainStyle,
  itemCardMediaBoxStyle,
  itemInformationBoxStyle,
  textIndentStyle,
  itemLinkStyle,
} from '../../services/styleService';
// =============================================
import { emptyMovie } from '../../constants';
import { resetStatus } from '../../store/slices/moviesSlice';
// =============================================
import useSnackbar from '../../hooks/useSnackbar';
// =============================================
import MoviesPlayer from './MoviesPlayer';

function MoviesItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const movies = useSelector((state) => state.moviesList.movies);
  const studiosList = useSelector((state) => state.studiosList.studios);
  const directorsList = useSelector((state) => state.directorsList.directors);
  const actorsList = useSelector((state) => state.actorsList.actors);

  const status = useSelector((state) => state.moviesList.status);

  const { snackbar, showSnackbar, handleClose } = useSnackbar(() =>
    dispatch(resetStatus())
  );

  const prevStatusRef = useRef();
  const [tabIndex, setTabIndex] = useState(0);

  const goBack = () => {
    navigate('/movies');
  };

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const currentStatus = status;

    if (
      currentStatus &&
      currentStatus !== prevStatus &&
      currentStatus !== 'loading'
    ) {
      const severity = currentStatus.toLowerCase().includes('success')
        ? 'success'
        : 'error';
      showSnackbar(currentStatus, severity);
    }

    prevStatusRef.current = currentStatus;
  }, [status, showSnackbar]);

  const movie = movies.find((movie) => Number(movie.id) === Number(id));
  const currentMovie = movie ? movie : emptyMovie;

  const filteredStudiosList = studiosList
    .filter((studio) => {
      for (let i = 0; i < currentMovie.studios.length; i++) {
        if (studio.title.includes(currentMovie.studios[i])) {
          return true;
        }
      }
      return false;
    })
    .map((studio) => ({ id: studio.id, title: studio.title }));

  const formattedStudios =
    filteredStudiosList.length > 0
      ? filteredStudiosList
          .map((studio) => (
            <Link
              key={studio.id}
              to={`/studios/${studio.id}`}
              style={itemLinkStyle}
            >
              {studio.title}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr])
      : 'No studios available';

  const filteredDirectorsList = directorsList
    .filter((director) => {
      for (let i = 0; i < currentMovie.directors.length; i++) {
        if (director.full_name.includes(currentMovie.directors[i])) {
          return true;
        }
      }
      return false;
    })
    .map((director) => ({ id: director.id, full_name: director.full_name }));

  const formattedDirectors =
    filteredDirectorsList.length > 0
      ? filteredDirectorsList
          .map((director) => (
            <Link
              key={director.id}
              to={`/directors/${director.id}`}
              style={itemLinkStyle}
            >
              {director.full_name}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr])
      : 'No directors available';

  const filteredActorsList = actorsList
    .filter((actor) => {
      for (let i = 0; i < currentMovie.actors.length; i++) {
        if (actor.full_name.includes(currentMovie.actors[i])) {
          return true;
        }
      }
      return false;
    })
    .map((actor) => ({ id: actor.id, full_name: actor.full_name }));

  const formattedActors =
    filteredActorsList.length > 0
      ? filteredActorsList
          .map((actor) => (
            <Link
              key={actor.id}
              to={`/actors/${actor.id}`}
              style={itemLinkStyle}
            >
              {actor.full_name}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr])
      : 'No actors available';

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Stack direction='row' justifyContent='space-between'>
        <Button
          type='button'
          variant='contained'
          color='info'
          sx={buttonMainStyle}
          startIcon={<KeyboardBackspaceIcon />}
          onClick={goBack}
        >
          To movies
        </Button>

        <Button
          type='button'
          variant='contained'
          color='warning'
          sx={buttonMainStyle}
          startIcon={<EditIcon />}
          component={Link}
          to={`/movies/new/${id}`}
        >
          Edit
        </Button>

        <Button
          component={Link}
          to='/movies/new'
          type='button'
          variant='contained'
          color='success'
          sx={buttonMainStyle}
          startIcon={<VideoCallIcon />}
        >
          Add movie
        </Button>
      </Stack>
      <Divider />
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label='movie details tabs'
      >
        <Tab label='About the movie' />
        {currentMovie.trailer && <Tab label='Movie trailer' />}
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={scrollItemBoxStyle}>
          <Box sx={itemComponentBoxMainStyle}>
            <Box sx={itemCardMediaBoxStyle}>
              <Card>
                <CardMedia
                  component='img'
                  height='100%'
                  image={
                    currentMovie.poster ||
                    'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg'
                  }
                  alt={currentMovie.title}
                />
              </Card>
            </Box>
            <Box sx={itemInformationBoxStyle}>
              <Typography
                variant='h5'
                component='div'
                sx={{ fontWeight: 'bold' }}
              >
                {currentMovie.title || 'Unknown movie'}
              </Typography>
              <Stack direction='row' spacing={1}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                  }}
                  component='div'
                >
                  Movie year:
                </Typography>
                <Typography variant='body1' component='div'>
                  {currentMovie.release_year || 'Unknown'}
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                  }}
                  component='div'
                >
                  Genre:
                </Typography>
                <Typography variant='body1' component='div'>
                  {currentMovie.genre || 'Unknown'}
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} sx={{ marginTop: 2 }}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                  }}
                  component='div'
                >
                  Studios:
                </Typography>
                <Typography variant='body1' component='div'>
                  {formattedStudios}
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} sx={{ marginTop: 2 }}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                  }}
                  component='div'
                >
                  Directors:
                </Typography>
                <Typography variant='body1' component='div'>
                  {formattedDirectors}
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} sx={{ marginTop: 2 }}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                  }}
                  component='div'
                >
                  Actors:
                </Typography>
                <Typography variant='body1' component='div'>
                  {formattedActors}
                </Typography>
              </Stack>

              {currentMovie.storyline && (
                <>
                  <Divider sx={{ marginTop: 2 }} />
                  <Typography
                    variant='body1'
                    component='div'
                    sx={textIndentStyle}
                  >
                    {currentMovie.storyline}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {tabIndex === 1 && currentMovie.trailer && <MoviesPlayer />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MoviesItem;
