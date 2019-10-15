import { Application } from 'express';
import { initApp } from './express';
import { initDb } from './mongoose';
import { logger } from './logger';
import { initInjection as initDI } from './inversify';

export * from './logger';

export async function load(app: Application): Promise<void> {
  await initDb();

  logger.info('DB_CONNECTED');

  initDI();

  logger.info('DI_LOADED');

  initApp(app);

  logger.info('APP_LOADED');
}
