import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-err';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  let payload;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  try {
    payload = jwt.verify(token, 'super-strong-secret') as { _id: string };
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
