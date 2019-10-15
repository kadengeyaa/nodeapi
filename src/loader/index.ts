import { Application } from 'express';
import { initApp } from './express';
import { initDb } from './mongoose';
import { logger } from './logger';

export * from './logger';

export async function load(app: Application): Promise<void> {
  await initDb();

  logger.info('DB_CONNECTED');

  initApp(app);

  logger.info('APP_LOADED');
}
