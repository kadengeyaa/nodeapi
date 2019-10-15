import { Router } from 'express';
import { authRouter } from './auth';

export function v1Router(): Router {
  const router = Router();

  router.use('/auth', authRouter());

  return router;
}
