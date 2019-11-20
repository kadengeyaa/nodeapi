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
    next();
  }
}
