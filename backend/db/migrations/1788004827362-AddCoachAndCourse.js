/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddCoachAndCourse1788004827362 {
    name = 'AddCoachAndCourse1788004827362'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "COACH" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "experience_years" integer NOT NULL, "description" text NOT NULL, "profile_image_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "REL_9970257bf1fb6ac7b8c2b13263" UNIQUE ("user_id"), CONSTRAINT "PK_86122345454fa1389314e7a74be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COACHSKILL" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coach_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_23a4d7ab7b3670a87728c5b3af6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COURSE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" text NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "max_participants" integer NOT NULL, "meeting_url" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_1dcd712a4d39dcfd9d46ca0ae11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "COACH" ADD CONSTRAINT "FK_9970257bf1fb6ac7b8c2b13263c" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHSKILL" ADD CONSTRAINT "FK_032377a5b778f4638974f2a080b" FOREIGN KEY ("coach_id") REFERENCES "COACH"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHSKILL" ADD CONSTRAINT "FK_0b2ce87ef6a948f5b505dbe5b9f" FOREIGN KEY ("skill_id") REFERENCES "SKILL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_7c9837d128ab474cb3d409b448d" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_10d952a5e55998cf12f448fcfab" FOREIGN KEY ("skill_id") REFERENCES "SKILL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_10d952a5e55998cf12f448fcfab"`);
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_7c9837d128ab474cb3d409b448d"`);
        await queryRunner.query(`ALTER TABLE "COACHSKILL" DROP CONSTRAINT "FK_0b2ce87ef6a948f5b505dbe5b9f"`);
        await queryRunner.query(`ALTER TABLE "COACHSKILL" DROP CONSTRAINT "FK_032377a5b778f4638974f2a080b"`);
        await queryRunner.query(`ALTER TABLE "COACH" DROP CONSTRAINT "FK_9970257bf1fb6ac7b8c2b13263c"`);
        await queryRunner.query(`DROP TABLE "COURSE"`);
        await queryRunner.query(`DROP TABLE "COACHSKILL"`);
        await queryRunner.query(`DROP TABLE "COACH"`);
    }
}
