const { EntitySchema } = require('typeorm')


module.exports = new EntitySchema({
    name:"CreditPackage",
    tableName:"CREDITPACKAGE",
    columns:{
        id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        name:{
            type:"varchar",
            length:256,
            nullable:false,
            unique:true
        },
        credit_amount:{
            type:"integer",
            nullable:false,
            unique:false
        },
        price:{
            type:"integer",
            nullable:false,
            unique:false
        }
    }
})