import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRecordsTable1693233420723 implements MigrationInterface {
  name = 'UpdateRecordsTable1693233420723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "records"
        `);
    await queryRunner.query(`
            DELETE FROM "data_checks"
        `);

    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "exam_uid"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "position"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "label"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "index"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "time"
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "record_id" text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "metadata" json NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "records"
        `);
    await queryRunner.query(`
            DELETE FROM "data_checks"
        `);

    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "metadata"
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "record_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "time" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "index" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "label" text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "position" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD "exam_uid" text NOT NULL
        `);
  }
}
