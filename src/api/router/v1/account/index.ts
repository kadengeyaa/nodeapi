import { Router } from 'express';
import { userRouter } from './user';

export function accountRouter(): Router {
  const router = Router();

  router.use('/user', userRouter());

  return router;
}
