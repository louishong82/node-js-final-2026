const express = require('express');
const router = express.Router();
const { dataSource } = require('../../db/data-source');
const authMiddleware = require('../../middleware/auth');
const { IsNull } = require('typeorm');

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


router.post('/:courseId', authMiddleware, async (req, res) => {
    try {
        const course = await dataSource.getRepository('Course').findOneBy({ id: req.params.courseId });
        if (!course) {
            return res.status(400).json({ status: 'failed', message: 'ID錯誤' });
        }

        const existBooking = await dataSource.getRepository('CourseBooking').findOneBy({
            user: { id: req.user.id },
            course: { id: course.id }
        });
        if (existBooking) {
            return res.status(400).json({ status: 'failed', message: '已經報名過此課程' });
        }

        const purchases = await dataSource.getRepository('CreditPackagePurchase').find({
            where: { user: { id: req.user.id } }
        });
        const totalCredits = purchases.reduce((sum, p) => sum + p.purchased_credits, 0);

        const activeBookingCount = await dataSource.getRepository('CourseBooking').count({
            where: { user: { id: req.user.id }, cancelled_at: null }
        });

        const creditRemain = totalCredits - activeBookingCount;
        if (creditRemain <= 0) {
            return res.status(400).json({ status: 'failed', message: '已無可使用堂數' });
        }

        const courseActiveBookingCount = await dataSource.getRepository('CourseBooking').count({
            where: { course: { id: course.id }, cancelled_at: null }
        });
        if (courseActiveBookingCount >= course.max_participants) {
            return res.status(400).json({ status: 'failed', message: '已達最大參加人數，無法參加' });
        }

        await dataSource.getRepository('CourseBooking').save({
            user: { id: req.user.id },
            course: { id: course.id }
        });

        return res.status(201).json({ status: 'success', data: null });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

router.delete('/:courseId', authMiddleware, async (req, res) => {
    try {
        const booking = await dataSource.getRepository('CourseBooking').findOneBy({
            user: { id: req.user.id },
            course: { id: req.params.courseId },
            cancelled_at: IsNull()
        });
        if (!booking) {
            return res.status(400).json({ status: 'failed', message: 'ID錯誤' });
        }

        await dataSource.getRepository('CourseBooking').update(
            { id: booking.id },
            { cancelled_at: new Date() }
        );

        return res.status(200).json({ status: 'success', data: null });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

module.exports = router;