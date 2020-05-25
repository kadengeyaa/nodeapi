import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { Principal } from '../provider/auth';

@injectable()
export class PermitAdminMiddleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const principal = this.httpContext.user as Principal;

      const isAdmin = await principal.hasPermission(['admin']);

      if (isAdmin) return next();

      throw new Error('You do not have permissions to access this resource. You are not an admin');
    } catch (error) {
      (error as DefaultError).code = '403';
      (error as DefaultError).status = 403;
      next(error);
    }
  }
}
