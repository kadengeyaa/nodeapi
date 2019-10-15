import { Router } from 'express';
import { signUpRouter } from './signUp';
import { signInRouter } from './signIn';

export function authRouter(): Router {
  const router = Router();

  router.use('/signup', signUpRouter());
  router.use('/signin', signInRouter());

  return router;
}
