const express = require('express');
const router = express.Router();
const { dataSource } = require('../../db/data-source');

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const courses = await dataSource.getRepository('Course')
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.skill', 'skill')
            .leftJoinAndSelect('course.user', 'user')
            .where('course.start_at <= :now', { now })
            .andWhere('course.end_at > :now', { now })
            .getMany();

        const data = courses.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            start_at: c.start_at,
            end_at: c.end_at,
            max_participants: c.max_participants,
            coach_name: c.user.name,
            skill_name: c.skill.name
        }));

        return res.status(200).json({ status: 'success', data });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

module.exports = router;