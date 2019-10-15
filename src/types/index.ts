type DefaultError = Error & {
  code?: string;
  status?: number;
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
