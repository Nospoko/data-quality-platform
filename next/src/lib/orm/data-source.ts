import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm';

import { DataCheck } from './entity/DataCheck';
import { Dataset } from './entity/Dataset';
import { DatasetAccess } from './entity/DatasetAccess';
import { Organization } from './entity/Organization';
import { OrganizationMembership } from './entity/OrganizationMembership';
import { Record } from './entity/Record';
import { User } from './entity/User';

// Don't remove next lines
dotenv.config({
  path: path.resolve(__dirname, '../../../.env.local'),
});

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: ['./src/lib/orm/entity/**/*.ts'],
  migrations: ['./src/lib/orm/migration/**/*.ts'],
});

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: [
    User,
    Record,
    DataCheck,
    Dataset,
    DatasetAccess,
    Organization,
    OrganizationMembership,
  ],
});

export async function customGetRepository<Entity extends ObjectLiteral>(
  EntityClass: ObjectType<Entity>,
): Promise<Repository<Entity>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource.getRepository(EntityClass);
}
