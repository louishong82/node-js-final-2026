/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddCreditPackage1787974301238 {
    name = 'AddCreditPackage1787974301238'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "CREDITPACKAGE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "credit_amount" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "UQ_5f7fcfe6a64e810c8dbad5f77e8" UNIQUE ("name"), CONSTRAINT "PK_7c075d2494e100e0b8ca472f734" PRIMARY KEY ("id"))`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "CREDITPACKAGE"`);
    }
}
