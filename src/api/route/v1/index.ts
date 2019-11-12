import { Router } from 'express';
import { authRouter } from './auth';
import { accountRouter } from './account';

export function v1Router(): Router {
  const router = Router();

  router.use('/auth', authRouter());
  router.use('/account', accountRouter());

  return router;
}
