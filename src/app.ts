import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '650c8c1b8139799e345e9ba8',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
