import { Db } from 'mongodb';
import mongoose from 'mongoose';
import { MONGO_DB_URI } from '../config';

export async function initDb(): Promise<Db> {
  const connection = await mongoose.connect(MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return connection.connection.db;
}
