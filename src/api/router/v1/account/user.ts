import { Router } from 'express';
import { container } from '../../../../loader/inversify';
import { AuthController } from '../../../controller/auth';
import { UserController } from '../../../controller/user';

export function userRouter(): Router {
  const router = Router();

  router.put(
    '/',
    container.get(AuthController).attachTokenToRequest(),
    container.get(AuthController).attachUserToRequest(),
    container.get(UserController).verifyUpdateRequest(),
    container.get(UserController).checkUpdatePermission(),
    container.get(UserController).update(),
  );

  return router;
}
