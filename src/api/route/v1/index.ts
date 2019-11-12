import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';

export function v1Router(): Router {
  const router = Router();

  router.use('/auth', authRouter());
  router.use('/user', userRouter());

  return router;
}
