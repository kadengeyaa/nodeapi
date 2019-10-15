import { Router } from 'express';
import { signUpRouter } from './signUp';

export function authRouter(): Router {
  const router = Router();

  router.use('/signup', signUpRouter());

  return router;
}
