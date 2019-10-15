import { celebrate, Joi } from 'celebrate';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { NAME_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../../../../model';

export function verify(): RequestHandler {
  return celebrate({
    body: Joi.object({
      firstName: Joi.string().regex(NAME_REGEX),
      lastName: Joi.string().regex(NAME_REGEX),
      username: Joi.string().regex(USERNAME_REGEX),
      password: Joi.string().regex(PASSWORD_REGEX),
    }),
  });
}

export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
  } catch (error) {
    next(error);
  }
}
