const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name:"CoachSkill",
    tableName:"COACHSKILL",
    columns:{
        id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
    },
    relations:{
        coach:{
            target:"Coach",
            type:"many-to-one",
            joinColumn:{name:"coach_id"},
            nullable:false
        },
        skill:{
            target:"Skill",
            type:"many-to-one",
            joinColumn:{name:"skill_id"},
            nullable:false
        }
    }
})