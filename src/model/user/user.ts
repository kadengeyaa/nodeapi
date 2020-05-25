import { Schema, model, Document } from 'mongoose';
import { defaultPlugin } from '../../plugin/default';
import { PagedModel, SearchableModel } from '../../plugin/types';

export type Role = 'default' | 'admin' | 'supervisor' | 'support' | 'registrar';

export type Status = 'active' | 'blocked';

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
};

export type UserDocument = Document & User;

type UserModel = PagedModel<UserDocument> & SearchableModel<UserDocument>;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      es_indexed: true,
      es_type: 'text',
      es_analyzer: 'autocomplete',
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      es_indexed: true,
      es_type: 'text',
      es_analyzer: 'autocomplete',
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
      es_indexed: true,
      es_type: 'text',
      es_analyzer: 'autocomplete',
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      es_indexed: true,
      es_type: 'text',
      es_analyzer: 'autocomplete',
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      es_indexed: true,
      es_type: 'text',
      es_analyzer: 'autocomplete',
    },
    role: {
      type: String,
      default: 'default',
      enum: ['default', 'admin', 'supervisor', 'support'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'blocked'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.plugin(defaultPlugin, { searchable: true });

userSchema.methods.toJSON = function (): User {
  const user: User = this.toObject();
  delete user.password;

  return user;
};

export const UserModel = model<UserDocument, UserModel>('User', userSchema);
