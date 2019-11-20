import { Request, Response } from 'express';
import { UserService } from '../../service/user';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { NAME_REGEX, USERNAME_REGEX } from '../../model/user';
import { httpPut, controller } from 'inversify-express-utils';
import { AuthMiddleware } from '../middleware/auth';

@controller('/v1/account', AuthMiddleware)
export class UserController {
  @inject(UserService)
  private userService: UserService;

  @httpPut(
    '/user',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        firstName: Joi.string().regex(NAME_REGEX),
        lastName: Joi.string().regex(NAME_REGEX),
        username: Joi.string().regex(USERNAME_REGEX),
      }),
    }),
  )
  async update(req: Request, res: Response): Promise<void> {
    const { id, firstName, lastName, username } = req.body;

    const user = await this.userService.update(id, { firstName, lastName, username });

    res.json({ user });
  }
}
