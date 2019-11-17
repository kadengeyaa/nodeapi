import { RequestHandler } from 'express';
import { container } from '../../loader/inversify';
import { UserService } from '../../service/user';

export const attachUser: RequestHandler = async (req, res, next) => {
  try {
    (req as RequestParamsDictionary).user = await container
      .get(UserService)
      .findById((req as RequestParamsDictionary).token._id);

    next();
  } catch (error) {
    next(error);
  }
};
