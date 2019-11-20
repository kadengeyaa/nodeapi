import { Router } from 'express';
import { celebrate } from 'celebrate';
import Joi = require('@hapi/joi');
import { container } from '../../../../loader/inversify';
import { AuthService } from '../../../../service/auth';

export function signInRouter(): Router {
  const router = Router();

  router.post(
    '/',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const authService = container.get(AuthService);

        const user = await authService.signIn(req.body as UserSignIn);

        res.set('Authorization', `Bearer ${authService.getToken(user)}`);

        res.json({ user });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
