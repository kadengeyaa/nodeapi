import { Router } from 'express';
import { confirmSignUpBody, signUp } from './signUp';

export function authRouter(): Router {
  const router = Router();

  router.post('signup', confirmSignUpBody, signUp);

  return router;
}
