import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { UserService } from '../../service/user';
import { interfaces } from 'inversify-express-utils';
import { AuthService } from '../../service/auth';

export class Principal implements interfaces.Principal {
  public details: User;

  constructor(details: User) {
    this.details = details;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!this.details;
  }

  async isResourceOwner(resource: { type: 'user'; id: string }): Promise<boolean> {
    if (this.details && resource.type === 'user') return resource.id === this.details._id;

    return false;
  }

  async isInRole(role: 'user'): Promise<boolean> {
    return !!this.details && role === 'user';
  }
}

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @inject(UserService)
  private userService: UserService;

  @inject(AuthService)
  private authService: AuthService;

  async getUser(req: Request, res: Response, next: NextFunction): Promise<interfaces.Principal> {
    try {
      let user: User;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        if (token) {
          user = await this.authService.decode(token);

          user = await this.userService.findById(user._id);

          user.role = 'user';
        }
      }

      return new Principal(user);
    } catch (error) {
      next(error);
    }
  }
}
