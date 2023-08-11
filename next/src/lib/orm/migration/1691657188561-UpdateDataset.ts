import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDataset1691657188561 implements MigrationInterface {
  name = 'UpdateDataset1691657188561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "datasets"
            ADD "is_active" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "datasets" DROP COLUMN "is_active"
        `);
  }
}
