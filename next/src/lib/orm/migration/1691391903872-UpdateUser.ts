import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1691391903872 implements MigrationInterface {
  name = 'UpdateUser1691391903872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
  }
}
