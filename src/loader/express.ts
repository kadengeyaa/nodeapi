import { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';
import { serializeError, ErrorObject } from 'serialize-error';
import { NODE_ENV } from '../config/server';
import { isCelebrate } from 'celebrate';

export function configExpress(app: Application): void {
  app.enable('trust proxy');

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));

  morganBody(app);
}

export function configExpressNotFoundError(app: Application): void {
  app.use((req, res, next) => {
    const error: DefaultError = new Error('URL not found');

    error.code = '404';
    error.status = 404;

    next(error);
  });
}

export function configExpressError(app: Application): void {
  app.use((error: DefaultError, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrate(error)) {
      error.name = error.joi.name;
      error.message = error.joi.message;
      error.stack = error.joi.stack;

      delete error.joi;
      delete error.meta;
    }

    const serializedError: ErrorObject & {
      status?: number;
    } = serializeError(error);

    serializedError.code = serializedError.code || '500';

    delete serializedError.status;

    if (NODE_ENV !== 'development') delete serializedError.stack;

    res.status(error.status || 500).json({ error: serializedError });

    next();
  });
}
