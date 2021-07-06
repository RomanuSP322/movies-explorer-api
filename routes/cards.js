const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неверная ссылка');
    }),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
