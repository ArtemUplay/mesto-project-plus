import { Request, Response, NextFunction } from 'express';

interface ExpressError extends Error {
  statusCode: number;
}

export default (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
};
