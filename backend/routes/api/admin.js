const express = require('express');
const router = express.Router();
const {dataSource} = require('../../db/data-source');
const authMiddleware = require('../../middleware/auth');
const checkCoach = require('../../middleware/checkCoach');


router.get('/',authMiddleware,checkCoach,async(req,res)=>{
    try{
        const coach = await dataSource.getRepository('Coach').findOneBy({ user: { id: req.user.id } });
        const coachSkills = await dataSource.getRepository('CoachSkill').find({
            where: { coach: { id: coach.id } },
            relations: ['skill']
        });
        const skill_ids = coachSkills.map(cs => cs.skill.id);
        return res.status(200).json({
            status: 'success',
            data: {
                id: coach.id,
                experience_years: coach.experience_years,
                description: coach.description,
                profile_image_url: coach.profile_image_url,
                skill_ids
            }
        });
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})

router.put('/',authMiddleware, checkCoach,async(req,res)=>{
    try{
        if(
            !Number.isInteger(req.body.experience_years) ||
            req.body.experience_years < 0 ||
            !req.body.description ||
            !req.body.description.trim() ||
            !req.body.profile_image_url ||
            !req.body.profile_image_url.trim() ||
            !req.body.profile_image_url.startsWith('https')||
            !Array.isArray(req.body.skill_ids) ||
            req.body.skill_ids.length === 0
        ){
            return res.status(400).json({
                status:"failed",
                message: "欄位未填寫正確"
            })
        }
        const coach = await dataSource.getRepository('Coach').findOneBy({ user: { id: req.user.id } });
        await dataSource.getRepository('Coach').update(
            { id: coach.id },
            {
                experience_years: req.body.experience_years,
                description: req.body.description,
                profile_image_url: req.body.profile_image_url
            }
        );
        await dataSource.getRepository('CoachSkill').delete({ coach: { id: coach.id } });
        const coachSkillRepo = dataSource.getRepository('CoachSkill');
        const newCoachSkills = req.body.skill_ids.map(skillId => ({
            coach: { id: coach.id },
            skill: { id: skillId }
        }));
        await coachSkillRepo.save(newCoachSkills);

        return res.status(200).json({
            status: 'success',
            data: {
                id: coach.id,
                experience_years: req.body.experience_years,
                description: req.body.description,
                profile_image_url: req.body.profile_image_url,
                skill_ids: req.body.skill_ids
            }
        });
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})

router.post('/courses', authMiddleware, checkCoach, async (req, res) => {
      try {
          if (
              !req.body.skill_id ||
              !req.body.name || !req.body.name.trim() ||
              !req.body.description || !req.body.description.trim() ||
              !req.body.start_at ||
              !req.body.end_at ||
              !Number.isInteger(req.body.max_participants) || req.body.max_participants < 0 ||
              !req.body.meeting_url || !req.body.meeting_url.startsWith('https')
          ) {
              return res.status(400).json({ status: 'failed', message: '欄位未填寫正確' });
          }

          const coach = await dataSource.getRepository('Coach').findOneBy({ user: { id: req.user.id } });

          const newCourse = await dataSource.getRepository('Course').save({
              name: req.body.name,
              description: req.body.description,
              start_at: req.body.start_at,
              end_at: req.body.end_at,
              max_participants: req.body.max_participants,
              meeting_url: req.body.meeting_url,
              user: { id: req.user.id },
              skill: { id: req.body.skill_id }
          });

          return res.status(201).json({
              status: 'success',
              data: { course: newCourse }
          });
      } catch (err) {
          return res.status(400).json({ status: 'failed', message: err.message });
      }
  });
router.get('/courses', authMiddleware, checkCoach, async (req, res) => {
  try {
      const courses = await dataSource.getRepository('Course').find({
          where: { user: { id: req.user.id } }
      });

      const now = new Date();
      const data = courses.map(course => {
          let status;
          if (now < new Date(course.start_at)) {
              status = '尚未開始';
          } else if (now > new Date(course.end_at)) {
              status = '已結束';
          } else {
              status = '進行中';
          }
          return {
              id: course.id,
              name: course.name,
              status,
              start_at: course.start_at,
              end_at: course.end_at,
              max_participants: course.max_participants,
              meeting_url: course.meeting_url,
              participants: 0
          };
      });

      return res.status(200).json({ status: 'success', data });
  } catch (err) {
      return res.status(400).json({ status: 'failed', message: err.message });
  }
});
  router.get('/courses/:courseId', authMiddleware, async (req, res) => {
      try {
          const course = await dataSource.getRepository('Course').findOne({
              where: { id: req.params.courseId, user: { id: req.user.id } },
              relations: ['skill']
          });
          if (!course) {
              return res.status(400).json({ status: 'failed', message: '課程不存在' });
          }
          return res.status(200).json({
              status: 'success',
              data: {
                  id: course.id,
                  name: course.name,
                  description: course.description,
                  start_at: course.start_at,
                  end_at: course.end_at,
                  max_participants: course.max_participants,
                  skill_name: course.skill.name,
                  skill_id: course.skill.id,
                  meeting_url: course.meeting_url
              }
          });
      } catch (err) {
          return res.status(400).json({ status: 'failed', message: err.message });
      }
  });

  router.put('/courses/:courseId', authMiddleware, async (req, res) => {
      try {
          if (
              !req.body.skill_id ||
              !req.body.name || !req.body.name.trim() ||
              !req.body.description || !req.body.description.trim() ||
              !req.body.start_at ||
              !req.body.end_at ||
              !Number.isInteger(req.body.max_participants) || req.body.max_participants < 0 ||
              !req.body.meeting_url || !req.body.meeting_url.startsWith('https')
          ) {
              return res.status(400).json({ status: 'failed', message: '欄位未填寫正確' });
          }

          const course = await dataSource.getRepository('Course').findOneBy({
              id: req.params.courseId,
              user: { id: req.user.id }
          });
          if (!course) {
              return res.status(400).json({ status: 'failed', message: '課程不存在' });
          }

          await dataSource.getRepository('Course').update(
              { id: course.id },
              {
                  name: req.body.name,
                  description: req.body.description,
                  start_at: req.body.start_at,
                  end_at: req.body.end_at,
                  max_participants: req.body.max_participants,
                  meeting_url: req.body.meeting_url,
                  skill: { id: req.body.skill_id }
              }
          );

            const updatedCourse = await dataSource.getRepository('Course').findOneBy({ id: course.id });

            return res.status(200).json({
                status: 'success',
                data: { course: updatedCourse }
            });
        } catch (err) {
            return res.status(400).json({ status: 'failed', message: err.message });
        }
    });

router.post('/:userId',async (req,res)=>{
    try{
        if( req.body.experience_years === undefined || 
            req.body.experience_years === null ||
            !req.body.description || 
            !req.body.description.trim() ||
            !Number.isInteger(req.body.experience_years) ||
            req.body.experience_years < 0 
        ){
            return res.status(400).json({
                status:"failed",
                message:"欄位未填寫正確"
            })
        }
        if (req.body.profile_image_url && !req.body.profile_image_url.startsWith('https')) {
            return res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確"
            });
        }
        const user = await dataSource.getRepository('Users').findOneBy({ id: req.params.userId });
        if (!user) {
            return res.status(400).json({ status: 'failed', message: '使用者不存在' });
        }
        const existCoach = await dataSource.getRepository('Coach').findOneBy({ user: { id: req.params.userId } });
        if (existCoach) {
            return res.status(409).json({ status: 'failed', message: '使用者已經是教練' });
        }
        const newCoach = await dataSource.getRepository('Coach').save({
            experience_years: req.body.experience_years,
            description: req.body.description,
            profile_image_url: req.body.profile_image_url || null,
            user: user
        });
        await dataSource.getRepository('Users').update({ id: user.id }, { role: 'COACH' });
        return res.status(201).json({
            status: 'success',
            data: {
                user: { name: user.name, role: 'COACH' },
                coach: newCoach
            }
        });
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
});

router.get('/revenue', authMiddleware, checkCoach, async (req, res) => {
    try {
        const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
        const monthIndex = monthNames.indexOf(req.query.month);
        if (!req.query.month || monthIndex === -1) {
            return res.status(400).json({ status: 'failed', message: '欄位未填寫正確' });
        }

        const year = new Date().getFullYear();
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 1);

        const courses = await dataSource.getRepository('Course').find({
            where: { user: { id: req.user.id } }
        });
        const courseIds = courses.map(c => c.id);

        if (courseIds.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: { total: { revenue: 0, participants: 0, course_count: 0 } }
            });
        }

        const { In, Between, IsNull } = require('typeorm');
        const bookings = await dataSource.getRepository('CourseBooking').find({
            where: {
                course: { id: In(courseIds) },
                cancelled_at: IsNull(),
                booked_at: Between(start, end)
            },
            relations: ['user']
        });

        const courseCount = bookings.length;
        const participantIds = new Set(bookings.map(b => b.user.id));
        const packages = await dataSource.getRepository('CreditPackage').find();
        const totalPrice = packages.reduce((sum, p) => sum + p.price, 0);
        const totalCredits = packages.reduce((sum, p) => sum + p.credit_amount, 0);
        const perCreditPrice = totalCredits > 0 ? totalPrice / totalCredits : 0;
        const revenue = Math.floor(courseCount * perCreditPrice);

        return res.status(200).json({
            status: 'success',
            data: {
                total: {
                    revenue,
                    participants: participantIds.size,
                    course_count: courseCount
                }
            }
        });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

module.exports = router