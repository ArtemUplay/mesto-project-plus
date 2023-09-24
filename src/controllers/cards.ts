import { Request, Response } from 'express';
import { ERROR_400, ERROR_404, ERROR_500 } from '../constants/constants';
import Card from '../models/cards';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(ERROR_404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(ERROR_404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Введены некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

export const addCardLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(ERROR_404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Введены некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

export const deleteCardLike = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(ERROR_404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Введены некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};
