import { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';
import { serializeError, ErrorObject } from 'serialize-error';
import { NODE_ENV } from '../config';

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

  app.use((req, res, next) => {
    const error: DefaultError = new Error('URL not found');

    error.code = '404';
    error.status = 404;

    next(error);
  });

  app.use((error: DefaultError, req: Request, res: Response, next: NextFunction) => {
    const serializedError: ErrorObject & {
      status?: number;
    } = serializeError(error);

    serializedError.code = serializedError.code || '500';
    serializedError.status = error.status || 500;

    if (NODE_ENV !== 'development') delete serializedError.stack;

    res.status(error.status || 500).json({ error: serializedError });

    next();
  });
}
