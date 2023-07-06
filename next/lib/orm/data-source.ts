import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm';

import { DataCheck } from './entity/DataCheck';
import { Record } from './entity/Record';
import { User } from './entity/User';

dotenv.config({
  path: path.resolve(__dirname, '../../.env.local'),
});

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: ['./lib/orm/entity/**/*.ts'],
  migrations: ['./lib/orm/migration/**/*.ts'],
});

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: [User, Record, DataCheck],
});

export async function customGetRepository<Entity extends ObjectLiteral>(
  EntityClass: ObjectType<Entity>,
): Promise<Repository<Entity>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource.getRepository(EntityClass);
}
