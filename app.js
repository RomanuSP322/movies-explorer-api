require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./errors/not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(auth);

app.use('/', moviesRouter);
app.use('/', usersRouter);
app.use(errorLogger);
app.use('/*', () => { throw new NotFoundError('Страница не найдена'); });
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => {

});
