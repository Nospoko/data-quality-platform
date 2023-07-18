import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChoiseDate1689596805258 implements MigrationInterface {
  name = 'AddChoiseDate1689596805258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "data_checks" DROP COLUMN "created_at"
        `);
  }
}
