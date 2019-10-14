import { Application } from 'express';
import { initApp } from './express';

export * from './logger';

export async function load(app: Application): Promise<void> {
  initApp(app);
}
