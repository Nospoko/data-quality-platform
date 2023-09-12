import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1694511547654 implements MigrationInterface {
  name = 'Initial1694511547654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "record_id" text NOT NULL,
                "dataset_name" text,
                "metadata" json NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "datasets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_1bf831e43c559a240303e23d038" PRIMARY KEY ("id")
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
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id")
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
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'member', 'guest')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" text NOT NULL,
                "firstName" text,
                "lastName" text,
                "image" text,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'guest',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."data_checks_choice_enum" AS ENUM('approved', 'rejected', 'unknown')
        `);
    await queryRunner.query(`
            CREATE TABLE "data_checks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "choice" "public"."data_checks_choice_enum",
                "comment" text,
                "score_1" numeric,
                "score_2" numeric,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "record_id" uuid,
                "user_id" uuid,
                CONSTRAINT "PK_dd3725d34295ba1b05548ba2ef9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access"
            ADD CONSTRAINT "FK_b5fb8fa9d169506bb64d06f6f43" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access"
            ADD CONSTRAINT "FK_c9803696e536cbbc8bfd11c1e21" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "data_checks"
            ADD CONSTRAINT "FK_7f6a54e33a43bccc6cf9803bf74" FOREIGN KEY ("record_id") REFERENCES "records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "organization_memberships" DROP CONSTRAINT "FK_86ae2efbb9ce84dd652e0c96a49"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_memberships" DROP CONSTRAINT "FK_5352fc550034d507d6c76dd2901"
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access" DROP CONSTRAINT "FK_c9803696e536cbbc8bfd11c1e21"
        `);
    await queryRunner.query(`
            ALTER TABLE "dataset_access" DROP CONSTRAINT "FK_b5fb8fa9d169506bb64d06f6f43"
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
            DROP TYPE "public"."users_role_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_memberships"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP TABLE "dataset_access"
        `);
    await queryRunner.query(`
            DROP TABLE "datasets"
        `);
    await queryRunner.query(`
            DROP TABLE "records"
        `);
  }
}
