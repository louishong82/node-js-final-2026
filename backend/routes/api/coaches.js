const express = require('express');
const router = express.Router();
const {dataSource} = require('../../db/data-source')


router.get('/skill',async (req,res)=>{
    const skills = await dataSource.getRepository('Skill').find()
    res.status(200).json({
        "status":"success",
        "data":skills
    })
})

router.post('/skill',async(req,res)=>{
    try{
        if(!req.body.name || !req.body.name.trim() ){
            return res.status(400).json({
                status:"failed",
                message:"欄位未填寫正確"
            })
        }
        const nameMatch = await dataSource.getRepository('Skill').findOneBy({name:req.body.name}) 
        if(nameMatch ){
            return res.status(409).json({
                status:"failed",
                message:"資料重複"
            })
        }
        const newSkill = await dataSource.getRepository('Skill').save({
            name:req.body.name
        })
        return res.status(200).json({
            status:"success",
            data:newSkill
        })
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})

router.delete('/skill/:id',async(req,res)=>{
    try{
        const skill = await dataSource.getRepository('Skill').findOneBy({id:req.params.id})
        if(!skill){
            return res.status(400).json({
                status:"failed",
                message:"ID錯誤"
            })
        }
        await dataSource.getRepository('Skill').delete({id:req.params.id})
        return res.status(200).json({
            status:"success",
            message:"刪除成功"
        })
    }catch(err){
         return res.status(400).json({ status: 'failed', message: err.message })
    }
})

router.get('/',async(req,res)=>{
    try{
        const per = Number(req.query.per);
        const page = Number(req.query.page);
        if (
            req.query.per === undefined || req.query.page === undefined ||
            !Number.isInteger(per) || per < 0 ||
            !Number.isInteger(page) || page < 0
        ) {
            return res.status(400).json({ status: 'failed', message: '欄位未填寫正確' });
        }

        const coaches = await dataSource.getRepository('Coach').find({
            relations: ['user'],
            skip: (page - 1) * per,
            take: per
        });

        const data = coaches.map(c => ({
            id: c.id,
            user_id: c.user.id,
            name: c.user.name
        }));

        return res.status(200).json({ status: 'success', data });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
})
router.get('/:coachId', async (req, res) => {
    try {
        const coach = await dataSource.getRepository('Coach').findOne({
            where: { id: req.params.coachId },
            relations: ['user']
        });
        if (!coach) {
            return res.status(400).json({ status: 'failed', message: '找不到該教練' });
        }

        const coachSkills = await dataSource.getRepository('CoachSkill').find({
            where: { coach: { id: coach.id } },
            relations: ['skill']
        });
        const skills = coachSkills.map(cs => cs.skill.name);

        return res.status(200).json({
            status: 'success',
            data: {
                user: { name: coach.user.name, role: coach.user.role },
                coach: {
                    id: coach.id,
                    user_id: coach.user.id,
                    experience_years: coach.experience_years,
                    description: coach.description,
                    profile_image_url: coach.profile_image_url,
                    created_at: coach.created_at,
                    updated_at: coach.updated_at,
                    skills
                }
            }
        });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});
router.get('/:coachId/courses', async (req, res) => {
    try {
        const coach = await dataSource.getRepository('Coach').findOne({
            where: { id: req.params.coachId },
            relations: ['user']
        });
        if (!coach) {
            return res.status(400).json({ status: 'failed', message: '找不到該教練' });
        }

        const courses = await dataSource.getRepository('Course')
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.skill', 'skill')
            .where('course.user_id = :userId', { userId: coach.user.id })
            .andWhere('course.end_at > :now', { now: new Date() })
            .getMany();

        const data = courses.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            start_at: c.start_at,
            end_at: c.end_at,
            max_participants: c.max_participants,
            coach_name: coach.user.name,
            skill_name: c.skill.name
        }));

        return res.status(200).json({ status: 'success', data });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});
module.exports = router