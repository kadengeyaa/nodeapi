import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { SERVER_PORT } from './config';
import { logger, load } from './loader';

process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT_EXCEPTION: %o', error);

  process.exit(1);
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
  logger.error('UNHANDLED_REJECTION: Reason: %o', reason);
  logger.error('UNHANDLED_REJECTION: Promise: %o', promise);
});

async function serve(): Promise<void> {
  const app = express();

  await load(app);

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
