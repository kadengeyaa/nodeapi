import { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';
import { serializeError, ErrorObject } from 'serialize-error';
import { NODE_ENV } from '../config/server';
import { router } from '../api/router/app';
import { isCelebrate } from 'celebrate';

export function initApp(app: Application): void {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));

  morganBody(app);

  app.use('/', router());

  app.use((req, res, next) => {
    const error: DefaultError = new Error('URL not found');

    error.code = '404';
    error.status = 404;

    next(error);
  });

  app.use((error: DefaultError, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrate(error)) {
      error.name = error.joi.name;
      error.message = error.joi.message;
      error.stack = error.joi.stack;

      delete error.joi;
      delete error.meta;
    } else if (error.name === 'UnauthorizedError') {
      error.code = '401';

      delete error.inner;
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
