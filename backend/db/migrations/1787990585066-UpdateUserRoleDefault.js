/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateUserRoleDefault1787990585066 {
    name = 'UpdateUserRoleDefault1787990585066'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "role" SET DEFAULT 'USER'`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }
}
