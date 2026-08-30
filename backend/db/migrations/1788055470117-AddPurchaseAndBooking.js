/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddPurchaseAndBooking1788055470117 {
    name = 'AddPurchaseAndBooking1788055470117'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "CREDIT_PACKAGE_PURCHASE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchased_credits" integer NOT NULL, "price_paid" integer NOT NULL, "purchase_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "credit_package_id" uuid NOT NULL, CONSTRAINT "PK_a0f5e31ef6418dd939c268c1ebd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COURSE_BOOKING" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "booked_at" TIMESTAMP NOT NULL DEFAULT now(), "cancelled_at" TIMESTAMP, "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, CONSTRAINT "PK_88f0144d4507e4f42cb4e6a7c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE_PURCHASE" ADD CONSTRAINT "FK_2be90ec9a592f2b9112f9f7c294" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE_PURCHASE" ADD CONSTRAINT "FK_40aba750b3341816aea90d0f3e6" FOREIGN KEY ("credit_package_id") REFERENCES "CREDITPACKAGE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" ADD CONSTRAINT "FK_853e2392bad56b186c9df746eab" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" ADD CONSTRAINT "FK_c09f76aafa8ca07c6bca9af07a6" FOREIGN KEY ("course_id") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" DROP CONSTRAINT "FK_c09f76aafa8ca07c6bca9af07a6"`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" DROP CONSTRAINT "FK_853e2392bad56b186c9df746eab"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE_PURCHASE" DROP CONSTRAINT "FK_40aba750b3341816aea90d0f3e6"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE_PURCHASE" DROP CONSTRAINT "FK_2be90ec9a592f2b9112f9f7c294"`);
        await queryRunner.query(`DROP TABLE "COURSE_BOOKING"`);
        await queryRunner.query(`DROP TABLE "CREDIT_PACKAGE_PURCHASE"`);
    }
}
