import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-err';
import Card from '../models/cards';
import ForbiddenError from '../errors/forbidden-err';
import BadRequestError from '../errors/bad-request-err';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }

      res.send(cards);
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send(card);
    })
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

export const addCardLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send(card);
    })
    .catch(next);
};

export const deleteCardLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный идентификатор');
      } else {
        next(err);
      }
    })
    .catch(next);
};
