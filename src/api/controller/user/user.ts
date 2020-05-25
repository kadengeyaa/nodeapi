import { Request, Response } from 'express';
import { UserService } from '../../../service/user/user';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { httpPut, controller, BaseHttpController } from 'inversify-express-utils';
import { Auth0Middleware } from '../../middleware/auth';
import { NAME_REGEX, USERNAME_REGEX, EMAIL_REGEX } from '../../../util/regex';
import { PermitDefaultMiddleware } from '../../middleware/permission';

@controller('/v1/user', Auth0Middleware)
export class UserController extends BaseHttpController {
  @inject(UserService)
  private userService: UserService;

  @httpPut(
    '/',
    PermitDefaultMiddleware,
    celebrate({
      body: Joi.object({
        userId: Joi.string().required(),
        firstName: Joi.string().regex(NAME_REGEX),
        lastName: Joi.string().regex(NAME_REGEX),
        username: Joi.string().regex(USERNAME_REGEX),
        email: Joi.string().regex(EMAIL_REGEX),
        phoneNumber: Joi.string().regex(EMAIL_REGEX),
      }),
    }),
  )
  async update(req: Request, res: Response): Promise<void> {
    const { userId, firstName, lastName, username } = req.body;

    const user = await this.userService.update(userId, { firstName, lastName, username });

    res.json({ user });
  }
}
