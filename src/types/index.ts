type DefaultError = Error & {
  code?: string;
  status?: number;
};
