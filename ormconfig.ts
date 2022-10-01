import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

const env = process.env;

const entities = [path.join(__dirname, 'src/**/*.entity.{js,ts}')];
const migrations = [path.join(__dirname, 'dist/migrations/*.{js,ts}')];

const url = new URL(env.DATABASE_URL);
const db = url.pathname.replace('/', '');

export const connectionSource: DataSourceOptions = {
  type: 'postgres',
  host: url.hostname,
  port: Number(url.port),
  username: url.username,
  password: decodeURIComponent(url.password),
  database: env.NODE_ENV === 'test' ? db.replace(db, `${db}-test`) : db,
  synchronize: true,
  migrationsRun: false,
  dropSchema: false,
  logging: env.TYPEORM_LOGGING === 'true',
  entities,
  migrations,
};

export const dataSource = new DataSource(connectionSource);
