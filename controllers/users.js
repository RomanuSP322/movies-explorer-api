const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Некоректные данные');
        next(error);
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError('Пользователь уже зарегистрирован');
        next(error);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = {
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        }),
      };
      res.send(token);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Некоректные данные');
        next(error);
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    owner,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Некоректные данные');
        next(error);
      }
      next(err);
    });
};
