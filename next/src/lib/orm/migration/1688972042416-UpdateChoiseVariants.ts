import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChoiseVariants1688972042416 implements MigrationInterface {
  name = 'UpdateChoiseVariants1688972042416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."data_checks_choice_enum"
            RENAME TO "data_checks_choice_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."data_checks_choice_enum" AS ENUM('approved', 'rejected', 'unknown')
        `);
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ALTER COLUMN "choice" TYPE "public"."data_checks_choice_enum" USING "choice"::"text"::"public"."data_checks_choice_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."data_checks_choice_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."data_checks_choice_enum_old" AS ENUM('approved', 'rejected', 'custom')
        `);
    await queryRunner.query(`
            ALTER TABLE "data_checks"
            ALTER COLUMN "choice" TYPE "public"."data_checks_choice_enum_old" USING "choice"::"text"::"public"."data_checks_choice_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."data_checks_choice_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."data_checks_choice_enum_old"
            RENAME TO "data_checks_choice_enum"
        `);
  }
}
