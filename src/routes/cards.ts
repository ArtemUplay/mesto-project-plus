import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard
);
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCard
);
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  addCardLike
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardLike
);

export default router;
