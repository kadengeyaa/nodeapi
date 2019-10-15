import { Schema, model, Document } from 'mongoose';

export const NAME_REGEX = /^[^\W\d_]{2,32}$/;

export const USERNAME_REGEX = /^[\w]{2,32}$/;

export const PASSWORD_REGEX = /^[^\s]{8,32}$/;

const isName = (name: string): boolean => !!name.match(NAME_REGEX);

const isUsername = (username: string): boolean => !!username.match(USERNAME_REGEX);

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
    required: true,
  },
});

export const UserModel = model<User & Document>('User', userSchema);
