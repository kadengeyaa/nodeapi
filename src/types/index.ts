type DefaultError = Error & {
  code?: string;
  status?: number;
};

type User = {
  firstName: string;
  lastName: string;
  username?: string;
  password?: string;
  salt?: string;
};
