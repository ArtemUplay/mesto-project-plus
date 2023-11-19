import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addCardLike);
router.delete('/cards/:cardId/likes', deleteCardLike);

export default router;
