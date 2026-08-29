const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name:"Users",
    tableName:"USERS",
    columns:{
        id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        name:{
            type:"varchar",
            length:200,
            nullable:false,
            unique:false
        },
        email:{
            type:"varchar",
            length:200,
            nullable:false,
            unique:true
        },
        password:{
            type:"varchar",
            length:200,
            nullable:false,
            unique:false
        },
        role:{
            type:"varchar",
            length:200,
            nullable:false,
            default:"USER"
        }
    }
})