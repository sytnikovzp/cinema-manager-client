import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
// =============================================
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
// =============================================
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SaveIcon from '@mui/icons-material/Save';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// =============================================
import { createMovie, updateMovie } from '../../store/slices/moviesSlice';
import { emptyMovie, genres } from '../../constants';
// =============================================
import {
  formStyle,
  formItemStyle,
  fieldArrayStyle,
  buttonFormStyle,
} from '../../services/styleService';

function MovieForm() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.moviesList.movies);

  const { id } = useParams();
  const currentMovie = movies.find((movie) => Number(movie.id) === Number(id));

  const navigate = useNavigate();

  const goBack = () => {
    if (id !== ':id') {
      navigate(`/movies/${id}`);
    } else {
      navigate(`/movies`);
    }
  };

  const schema = Yup.object().shape({
    title: Yup.string().required('Movie title is a required field'),
    movieYear: Yup.date(),
    genre: Yup.string(),
    directors: Yup.array(),
    actors: Yup.array(),
    studios: Yup.array(),
    poster: Yup.string().url('Invalid URL poster'),
    trailer: Yup.string().url('Invalid Youtube URL trailer'),
    storyline: Yup.string(),
  });

  const onFormSubmit = (values) => {
    if (values.id) {
      dispatch(updateMovie(values));
      navigate(`/movies/${id}`);
    } else {
      dispatch(createMovie(values));
      navigate(`/movies`);
    }
  };

  const renderForm = ({ values, errors, touched, setFieldValue }) => {
    return (
      <Form id='movie-form'>
        <Box sx={formStyle}>
          <Box sx={formItemStyle}>
            <Field
              name='title'
              as={TextField}
              label='Title film'
              value={values.title}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Clear field'
                      onClick={() => setFieldValue('title', '')}
                      edge='end'
                    >
                      <BackspaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />
          </Box>
          <Box sx={formItemStyle}>
            <Field name='genre'>
              {({ field }) => (
                <TextField
                  {...field}
                  id='genre-select'
                  select
                  fullWidth
                  label='Genre movie'
                  error={touched.genre && Boolean(errors.genre)}
                  helperText={touched.genre && errors.genre}
                >
                  <MenuItem value=''>
                    <b>Genre select:</b>
                  </MenuItem>
                  {genres.map((option) => (
                    <MenuItem key={option.id} value={option.genre}>
                      {option.genre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Field>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name='date'
                label='Movie year'
                value={values.movieYear ? dayjs().year(values.movieYear) : null}
                views={['year']}
                onChange={(value) =>
                  setFieldValue('movieYear', value ? value.year() : '')
                }
                sx={{ width: '250px' }}
                slotProps={{
                  textField: {
                    error: touched.movieYear && Boolean(errors.movieYear),
                    helperText: touched.movieYear && errors.movieYear,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={formItemStyle}>
            <Field
              name='poster'
              as={TextField}
              label='Poster URL'
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Clear field'
                      onClick={() => setFieldValue('poster', '')}
                      edge='end'
                    >
                      <BackspaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={touched.poster && Boolean(errors.poster)}
              helperText={touched.poster && errors.poster}
            />
          </Box>
          <Box sx={formItemStyle}>
            <Field
              name='trailer'
              as={TextField}
              label='Trailer URL (Youtube only)'
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Clear field'
                      onClick={() => setFieldValue('trailer', '')}
                      edge='end'
                    >
                      <BackspaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={touched.trailer && Boolean(errors.trailer)}
              helperText={touched.trailer && errors.trailer}
            />
          </Box>
          <Box sx={formItemStyle}>
            <FieldArray name='directors'>
              {({
                push,
                remove,
                form: {
                  values: { directors },
                },
              }) => (
                <>
                  <Stack
                    component='fieldset'
                    form='movie-form'
                    spacing={2}
                    sx={fieldArrayStyle}
                  >
                    <Typography component='legend' variant='h6' gutterBottom>
                      Directors
                    </Typography>
                    {directors.map((director, index) => (
                      <Stack spacing={2} key={index} direction='row'>
                        <Field
                          name={`directors[${index}]`}
                          as={TextField}
                          label='Director'
                          fullWidth
                          error={touched.directors && Boolean(errors.directors)}
                          helperText={touched.directors && errors.directors}
                        />
                        {index > 0 && (
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => push('')}>
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </FieldArray>
          </Box>
          <Box sx={formItemStyle}>
            <FieldArray name='actors'>
              {({
                push,
                remove,
                form: {
                  values: { actors },
                },
              }) => (
                <>
                  <Stack
                    component='fieldset'
                    form='movie-form'
                    spacing={2}
                    sx={{
                      width: '100%',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      paddingBottom: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <Typography component='legend' variant='h6' gutterBottom>
                      Actors
                    </Typography>
                    {actors.map((actor, index) => (
                      <Stack spacing={2} key={index} direction='row'>
                        <Field
                          name={`actors[${index}]`}
                          as={TextField}
                          label='Actor'
                          fullWidth
                          error={touched.actors && Boolean(errors.actors)}
                          helperText={touched.actors && errors.actors}
                        />
                        {index > 0 && (
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => push('')}>
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </FieldArray>
          </Box>
          <Box sx={formItemStyle}>
            <FieldArray name='studios'>
              {({
                push,
                remove,
                form: {
                  values: { studios },
                },
              }) => (
                <>
                  <Stack
                    component='fieldset'
                    form='movie-form'
                    spacing={2}
                    sx={{
                      width: '100%',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      paddingBottom: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <Typography component='legend' variant='h6' gutterBottom>
                      Studios
                    </Typography>
                    {studios.map((studio, index) => (
                      <Stack spacing={2} key={index} direction='row'>
                        <Field
                          name={`studios[${index}]`}
                          as={TextField}
                          label='Studio'
                          fullWidth
                          error={touched.studios && Boolean(errors.studios)}
                          helperText={touched.studios && errors.studios}
                        />
                        {index > 0 && (
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => push('')}>
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </FieldArray>
          </Box>
          <Box sx={formItemStyle}>
            <Field
              name='storyline'
              as={TextField}
              label='Brief storyline of the movie...'
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Clear field'
                      onClick={() => setFieldValue('storyline', '')}
                      edge='end'
                    >
                      <BackspaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={touched.storyline && Boolean(errors.storyline)}
              helperText={touched.storyline && errors.storyline}
            />
          </Box>

          <Stack direction='row' justifyContent='center' spacing={1}>
            <Button
              type='button'
              variant='contained'
              sx={buttonFormStyle}
              onClick={goBack}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>

            <Button
              type='submit'
              variant='contained'
              color='success'
              sx={buttonFormStyle}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>

            <Button
              type='reset'
              variant='contained'
              color='error'
              sx={buttonFormStyle}
              startIcon={<ClearAllIcon />}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={currentMovie ? currentMovie : emptyMovie}
      onSubmit={onFormSubmit}
      validationSchema={schema}
      enableReinitialize
    >
      {renderForm}
    </Formik>
  );
}

export default MovieForm;
