import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

interface ICard {
  name: string;
  link: string;
  owner: typeof ObjectId;
  likes: (typeof ObjectId)[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        const regex =
          /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        return regex.test(v);
      },
      message: 'Неправильный формат URL',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<ICard>('card', cardSchema);
