import { Router } from 'express';
import { celebrate } from 'celebrate';
import Joi = require('@hapi/joi');
import { NAME_REGEX, USERNAME_REGEX } from '../../../../model';
import { container } from '../../../../loader/inversify';
import { UserService } from '../../../../service/user';
import { attachToken } from '../../../middleware/token';
import { attachUser } from '../../../middleware/user';

export function userRouter(): Router {
  const router = Router();

  router.put(
    '/',
    attachToken,
    attachUser,
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        firstName: Joi.string().regex(NAME_REGEX),
        lastName: Joi.string().regex(NAME_REGEX),
        username: Joi.string().regex(USERNAME_REGEX),
      }),
    }),
    async (req, res, next) => {
      try {
        const { id, firstName, lastName, username } = req.body;

        const user = await container.get(UserService).update(id, { firstName, lastName, username });

        return res.json({ user });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
