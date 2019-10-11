import { Application } from 'express';

export function initApp(app: Application): void {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });
}
