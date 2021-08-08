const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неверная ссылка');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неверная ссылка');
    }),
    nameRU: Joi.string().required().min(2).max(40),
    nameEN: Joi.string().required().min(2).max(40),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неверная ссылка');
    }),
    movieId: Joi.number().required(),
  }),
}), createMovie);
movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
