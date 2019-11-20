import { Response, Request } from 'express';
import { injectable, inject } from 'inversify';
import { UserService } from '../../service/user';
import { BaseMiddleware } from 'inversify-express-utils';
import { NextFunction } from 'connect';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  @inject(UserService)
  private userService: UserService;

  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user: User = await this.userService.findById((req as RequestParamsDictionary).token._id);

    user.role = 'user';

    (req as RequestParamsDictionary).user = user;

    next();
  }
}
