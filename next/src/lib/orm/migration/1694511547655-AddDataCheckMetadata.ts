import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDataCheckMetadata1694511547655 implements MigrationInterface {
  name = 'AddDataCheckMetadata1694511547655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD "metadata" json
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "data_checks" DROP COLUMN "metadata"
        `);
  }
}
