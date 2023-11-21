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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError(error.message));
      }

      next(error.message);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10).then((hash: string) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }

        res.status(201).send({ name, about, avatar, email });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequestError(error.message));
        } else if (error.code === 11000) {
          throw new ExistingEmailError('Email уже существует');
        } else {
          next(error.message);
        }
      });
  });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err.message);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err.message);
      }
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err.message);
      }
    });
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
      next(new UnauthorizedError(err.message));
    });
};
