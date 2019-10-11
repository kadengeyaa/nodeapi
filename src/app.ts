import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { SERVER_PORT } from './config';

process.on('uncaughtException', (error: Error) => {
  console.log('uncaughtException', error);

  process.exit(1);
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
  console.log('unhandledRejection: Reason', reason);
  console.log('unhandledRejection: Promise', promise);
});

async function startServer(): Promise<void> {
  const app = express();

  const server = http.createServer(app);

  server.on('error', error => {
    console.log('SERVER_ERROR', error);

    throw error;
  });

  server.listen(SERVER_PORT, () => {
    console.log('SERVER_STARTED', server.address());
  });
}

startServer();
