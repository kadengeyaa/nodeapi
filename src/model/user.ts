import { Schema, model, Document } from 'mongoose';

const isName = (name: string): boolean => !!name.match(/^[^\W\d_]+$/);

const isUsername = (username: string): boolean => !!username.match(/^[\w]+$/);

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: isName,
    },
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: isName,
    },
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: isUsername,
    },
  },
  password: {
    type: String,
    unique: true,
    lowercase: true,
  },
  salt: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

export const UserModel = model<User & Document>('User', userSchema);
