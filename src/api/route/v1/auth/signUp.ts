import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { NAME_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../../../../model';

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
    (req, res, next) => {
      try {
        res.json({});
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
