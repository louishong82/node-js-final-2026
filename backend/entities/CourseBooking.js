const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CourseBooking",
    tableName: "COURSE_BOOKING",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },
        booked_at: {
            type: "timestamp",
            createDate: true
        },
        cancelled_at: {
            type: "timestamp",
            nullable: true
        }
    },
    relations: {
        user: {
            target: "Users",
            type: "many-to-one",
            joinColumn: { name: "user_id" },
            nullable: false
        },
        course: {
            target: "Course",
            type: "many-to-one",
            joinColumn: { name: "course_id" },
            nullable: false
        }
    }
})