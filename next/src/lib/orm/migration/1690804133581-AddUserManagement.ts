import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1690804133581 implements MigrationInterface {
  name = 'UpdateSchema1690804133581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be1"
        `);
    await queryRunner.query(`
            CREATE TABLE "datasets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                CONSTRAINT "PK_1bf831e43c559a240303e23d038" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "organization_memberships" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "PK_cd7be805730a4c778a5f45364af" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "dataset_access" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "dataset_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "PK_06e4d0d7197b2575f2590e03141" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'member', 'guest')
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'guest'
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_memberships"
            ADD CONSTRAINT "FK_5352fc550034d507d6c76dd2901" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_memberships"
            ADD CONSTRAINT "FK_86ae2efbb9ce84dd652e0c96a49" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access"
            ADD CONSTRAINT "FK_b5fb8fa9d169506bb64d06f6f43" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access"
            ADD CONSTRAINT "FK_c9803696e536cbbc8bfd11c1e21" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dataset_access" DROP CONSTRAINT "FK_c9803696e536cbbc8bfd11c1e21"
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access" DROP CONSTRAINT "FK_b5fb8fa9d169506bb64d06f6f43"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_memberships" DROP CONSTRAINT "FK_86ae2efbb9ce84dd652e0c96a49"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_memberships" DROP CONSTRAINT "FK_5352fc550034d507d6c76dd2901"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "dataset_access"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_memberships"
        `);
    await queryRunner.query(`
            DROP TABLE "datasets"
        `);
    await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be1" UNIQUE ("exam_uid", "dataset_name", "position")
        `);
  }
}
