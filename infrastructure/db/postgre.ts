import path from 'path';
import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';

let postgre;

const logging = !!process.env.LOGGING;
const synchronize = !!process.env.SYNCHRONIZE;
const entities = [path.join(__dirname, '../../domain/entities/*.ts')];

if (process.env.DATABASE_URL) {
  const config: ConnectionOptions = {
    type: 'postgres',
    logging,
    synchronize,
    entities,
    url: process.env.DATABASE_URL,
  };
  postgre = config;
} else {
  const config: ConnectionOptions = {
    type: 'postgres',
    logging,
    synchronize,
    entities,
    host: process.env.POSTGRES_HOST || 'postgres',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'postgres_db',
  };
  postgre = config;
}

export default createConnection(postgre);
