import jwt from 'express-jwt';
import { RequestHandler } from 'express';
import { JWT_SECRET } from '../../config/jwt';

export const attachToken: RequestHandler = jwt({
  secret: JWT_SECRET,
  requestProperty: 'token',
}) as RequestHandler;
