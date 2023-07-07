import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1688644099344 implements MigrationInterface {
  name = 'Initial1688644099344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."ix_records_index"
        `);
    await queryRunner.query(`DELETE FROM records
            WHERE ctid IN (
                SELECT ctid
                FROM (
                SELECT ctid,
                ROW_NUMBER() OVER (partition BY index ORDER BY index) AS rn
                FROM records
                ) t
                WHERE t.rn > 1
            );`);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" text NOT NULL,
                "firstName" text,
                "lastName" text,
                "image" text,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."data_checks_choice_enum" AS ENUM('approved', 'rejected', 'custom')
        `);
    await queryRunner.query(`
            CREATE TABLE "data_checks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "choice" "public"."data_checks_choice_enum",
                "record_id" bigint,
                "user_id" uuid,
                CONSTRAINT "PK_dd3725d34295ba1b05548ba2ef9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "time"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "time"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "label"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "position"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "index"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "PK_efa89f2c5978aaf5dd17719c78f" PRIMARY KEY ("index")
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "exam_uid"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD CONSTRAINT "FK_7f6a54e33a43bccc6cf9803bf74" FOREIGN KEY ("record_id") REFERENCES "records"("index") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD CONSTRAINT "FK_3b69d7a1765b8c75b1066304a7a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "data_checks" DROP CONSTRAINT "FK_3b69d7a1765b8c75b1066304a7a"
        `);
    await queryRunner.query(`
            ALTER TABLE "data_checks" DROP CONSTRAINT "FK_7f6a54e33a43bccc6cf9803bf74"
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "exam_uid" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "PK_efa89f2c5978aaf5dd17719c78f"
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "index" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "position" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "label" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "time" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "time" DROP NOT NULL
        `);
    await queryRunner.query(`
            DROP TABLE "data_checks"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."data_checks_choice_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            CREATE INDEX "ix_records_index" ON "records" ("index")
        `);
  }
}
