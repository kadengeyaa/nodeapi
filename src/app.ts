import 'reflect-metadata';
import './config';
import './api/controller';
import http from 'http';
import { SERVER_PORT } from './config/server';
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { configExpressError, configExpress, configExpressNotFoundError } from './loader/express';
import { initDb } from './loader/mongoose';
import { getContainer } from './loader/inversify';
import { logger } from './loader/logger';
import { render } from 'prettyjson';

process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT_EXCEPTION: %o', error);

  process.exit(1);
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
  logger.error('UNHANDLED_REJECTION: Reason: %o', reason);
  logger.error('UNHANDLED_REJECTION: Promise: %o', promise);
});

async function serve(): Promise<void> {
  await initDb();

  logger.info('DB_CONNECTED');

  const container = getContainer();

  const app = new InversifyExpressServer(container).setConfig(configExpress).build();

  configExpressNotFoundError(app);

  configExpressError(app);

  logger.info('DI_LOADED');

  logger.info('ROUTES_LOADED');

  logger.debug(render(getRouteInfo(container)));

  logger.info('APP_LOADED');

  const server = http.createServer(app);

  server.on('error', error => {
    logger.error('SERVER_ERROR: %o', error);

    throw error;
  });

  server.listen(SERVER_PORT, () => {
    logger.info('SERVER_STARTED: %o', server.address());
  });
}

serve();
