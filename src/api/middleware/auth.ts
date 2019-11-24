import { Response, Request } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { NextFunction } from 'connect';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const isAuthenticated = await this.httpContext.user.isAuthenticated();

    if (isAuthenticated) return next();

    return next(new Error('Authentication failed'));
  }
}
