import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getCurrentUser, getUser, getUsers, updateAvatar, updateUser } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(20),
      about: Joi.string().min(2).max(200),
    }),
  }),
  updateUser
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri(),
    }),
  }),
  updateAvatar
);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser
);

export default router;
