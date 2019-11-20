import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { celebrate, Joi } from 'celebrate';
import { AuthService } from '../../service/auth';
import { NAME_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../../model/user';
import { Response, Request } from 'express';

@controller('/v1/auth')
export class AuthController {
  @inject(AuthService)
  private authService: AuthService;

  @httpPost(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
  )
  async signIn(req: Request, res: Response): Promise<void> {
    const user = await this.authService.signIn(req.body as UserSignIn);

    res.set('Authorization', `Bearer ${this.authService.getToken(user)}`);

    res.json({ user });
  }

  @httpPost(
    '/signup',
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
  )
  async signUp(req: Request, res: Response): Promise<void> {
    const user = await this.authService.signUp(req.body as UserSignUp);

    res.set('Authorization', `Bearer ${this.authService.getToken(user)}`);

    res.json({ user });
  }
}
