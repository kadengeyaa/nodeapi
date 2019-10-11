import { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';

export function initApp(app: Application): void {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(bodyParser.json());

  morganBody(app);

  app.use((req, res, next) => {
    next(new Error('URL not found'));
  });

  app.use((error: Error, req: Request, res: Response) => {
    res.status(401).json({ error });
  });
}
