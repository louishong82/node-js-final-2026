
const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CreditPackagePurchase",
    tableName: "CREDIT_PACKAGE_PURCHASE",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },
        purchased_credits: {
            type: "integer",
            nullable: false
        },
        price_paid: {
            type: "integer",
            nullable: false
        },
        purchase_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        user: {
            target: "Users",
            type: "many-to-one",
            joinColumn: { name: "user_id" },
            nullable: false
        },
        creditPackage: {
            target: "CreditPackage",
            type: "many-to-one",
            joinColumn: { name: "credit_package_id" },
            nullable: false
        }
    }
})