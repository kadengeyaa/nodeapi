import 'reflect-metadata';
import express from 'express';

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

  app.listen(9099, (error: Error) => {
    if (error) throw error;

    console.log('Server started');
  });
}

startServer();
