const moviesRouter = require('express').Router();
const {
  createMovies, getMovies, deleteMovies,
} = require('../controllers/movies');
const { validateCreateMovies, validateDeleteMovies } = require('../utils/validation');

// сохраненный фильм
moviesRouter.post('/', validateCreateMovies, createMovies);

// все сохранненные фильмы текущего пользователя
moviesRouter.get('/', getMovies);

// удаление сохраненного фильма
moviesRouter.delete('/:movieId', validateDeleteMovies, deleteMovies);

module.exports = moviesRouter;
