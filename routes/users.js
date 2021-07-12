const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isEmail = require('validator/lib/isEmail');

const {
  getMe,
  updateProfile,
} = require('../controllers/users');

userRouter.get('/users/me', getMe);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (isEmail(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Такой почты не существует');
    })
      .messages({
        'any.required': 'Поле должно быть заполнено',
      }),
  }),
}), updateProfile);

module.exports = userRouter;
