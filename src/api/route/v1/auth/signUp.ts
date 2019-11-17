import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { NAME_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../../../../model';
import { container } from '../../../../loader/inversify';
import { AuthService } from '../../../../service/auth';

export function signUpRouter(): Router {
  const router = Router();

  router.post(
    '/',
    celebrate({
      body: Joi.object({
        firstName: Joi.string()
          .required()
          .regex(NAME_REGEX),
        lastName: Joi.string()
          .required()
          .regex(NAME_REGEX),
        username: Joi.string()
          .required()
          .regex(USERNAME_REGEX),
        password: Joi.string()
          .required()
          .regex(PASSWORD_REGEX),
      }),
    }),
    async (req, res, next) => {
      try {
        const authService = container.get(AuthService);

        const user = await authService.signUp(req.body as UserSignUp);

        res.set('Authorization', `Bearer ${authService.getToken(user)}`);

        res.json({ user });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
