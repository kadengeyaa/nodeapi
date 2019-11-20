import { RequestHandler } from 'express';
import { UserService } from '../../service/user';
import { injectable, inject } from 'inversify';
import { celebrate } from 'celebrate';
import Joi = require('@hapi/joi');
import { NAME_REGEX, USERNAME_REGEX } from '../../model/user';
import { AccessControlService } from '../../service/access';

@injectable()
export class UserController {
  @inject(UserService)
  private userService: UserService;

  @inject(AccessControlService)
  private accessControlService: AccessControlService;

  verifyUpdateRequest(): RequestHandler {
    return celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        firstName: Joi.string().regex(NAME_REGEX),
        lastName: Joi.string().regex(NAME_REGEX),
        username: Joi.string().regex(USERNAME_REGEX),
      }),
    });
  }

  checkUpdatePermission(): RequestHandler {
    return async (req, res, next) => {
      try {
        const permission = await this.accessControlService
          .can((req as RequestParamsDictionary).user.role)
          .execute('update')
          .on('profile');

        if (!permission.granted) throw Error('Permission declined');

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  update(): RequestHandler {
    return async (req, res, next) => {
      try {
        const { id, firstName, lastName, username } = req.body;

        const user = await this.userService.update(id, { firstName, lastName, username });

        return res.json({ user });
      } catch (error) {
        next(error);
      }
    };
  }
}
