type joi = {
  name: string;
  message: string;
  stack: string;
};

type meta = {
  source: string;
};

type DefaultError = Error & {
  name?: string;
  stack?: string;
  code?: string;
  status?: number;
} & {
  joi?: joi;
  meta?: meta;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  salt: string;
};

type UserSignUp = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

type UserSignIn = {
  username: string;
  password: string;
};
