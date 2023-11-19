import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NotFoundError from '../errors/not-found-err';
import User from '../models/users';
import BadRequestError from '../errors/bad-request-err';
import ExistingEmailError from '../errors/existing-email-err';
import UnauthorizedError from '../errors/unauthorized-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }

      res.send(users);
    })
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Некорректный идентификатор');
      }
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10).then((hash: string) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }

        res.status(201).send(user);
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Введены некорректные данные');
        } else if (error.code === 11000) {
          throw new ExistingEmailError('Email уже существует');
        }
      })
      .catch(next);
  });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;

  User.findById(id)
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный идентификатор');
      }
    })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный идентификатор');
      }
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный идентификатор');
      }
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      });

      res.send({ message: 'Успешный вход' });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ExistingEmailError('Email уже существует');
      }

      throw new UnauthorizedError('Ошибка входа');
    })
    .catch(next);
};
