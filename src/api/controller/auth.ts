import jwt from 'express-jwt';
import { RequestHandler } from 'express';
import { JWT_SECRET } from '../../config/jwt';
import { injectable, inject } from 'inversify';
import { UserService } from '../../service/user';

@injectable()
export class AuthController {
  @inject(UserService)
  private userService: UserService;

  attachTokenToRequest(): RequestHandler {
    return jwt({
      secret: JWT_SECRET,
      requestProperty: 'token',
    });
  }

  attachUserToRequest(): RequestHandler {
    return async (req, res, next) => {
      try {
        const user: User = await this.userService.findById((req as RequestParamsDictionary).token._id);

        user.role = 'user';

        (req as RequestParamsDictionary).user = user;

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
