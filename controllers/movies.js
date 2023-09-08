const errorConstants = require('http2').constants;
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// создание фильма
module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(errorConstants.HTTP_STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(error);
      }
    });
};

// получение списка сохраненных фильмов
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(errorConstants.HTTP_STATUS_OK).send(movies))
    .catch(next);
};

// удаление фильма
module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Вы не можете удалять чужие фильмы'));
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .orFail()
        .then(() => res.status(errorConstants.HTTP_STATUS_OK).send({ message: `Фильм ${movie.nameRU} успешно удален` }))
        .catch((error) => {
          if (error instanceof mongoose.Error.CastError) {
            next(new BadRequestError('Некорректный id'));
          } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Фильм с указанным id не найден'));
          } else {
            next(error);
          }
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильм с указанным id не найден'));
      } else {
        next(error);
      }
    });
};
