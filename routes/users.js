const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const {
  getUsers,
  getUser,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неверная ссылка');
    })
      .messages({
        'any.required': 'Поле должно быть заполнено',
      }),
  }),
}), updateAvatar);

module.exports = router;
