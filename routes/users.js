const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMe,
  updateProfile,
} = require('../controllers/users');

userRouter.get('/users/me', getMe);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = userRouter;
