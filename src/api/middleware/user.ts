import { RequestHandler } from 'express';
import { container } from '../../loader/inversify';
import { UserService } from '../../service/user';

export const attachUser: RequestHandler = async (req, res, next) => {
  try {
    const user: User = await container.get(UserService).findById((req as RequestParamsDictionary).token._id);

    user.role = 'user';

    (req as RequestParamsDictionary).user = user;

    next();
  } catch (error) {
    next(error);
  }
};
