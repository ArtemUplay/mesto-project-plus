import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { Joi, celebrate, errors } from 'celebrate';
import { createUser, login } from './controllers/users';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import auth from './middlewares/auth';
import error from './middlewares/error';
import NotFoundError from './errors/not-found-err';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
      about: Joi.string().min(2).max(200).default('Исследователь'),
      avatar: Joi.string()
        .uri()
        .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
