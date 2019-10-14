import dotenv from 'dotenv';

const config = dotenv.config();

if (!config) throw new Error('Could not find .env file');

export * from './server';
export * from './logger';
