import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScoreFeedback1692357139915 implements MigrationInterface {
    name = 'AddScoreFeedback1692357139915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD "comment" text
        `);
        await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD "score_1" numeric
        `);
        await queryRunner.query(`
            ALTER TABLE "data_checks"
            ADD "score_2" numeric
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "data_checks" DROP COLUMN "score_2"
        `);
        await queryRunner.query(`
            ALTER TABLE "data_checks" DROP COLUMN "score_1"
        `);
        await queryRunner.query(`
            ALTER TABLE "data_checks" DROP COLUMN "comment"
        `);
    }

}
