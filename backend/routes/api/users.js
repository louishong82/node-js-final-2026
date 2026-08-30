const express = require('express');
const router = express.Router();
const {dataSource} = require('../../db/data-source');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/auth');

router.post('/signup',async (req,res)=>{
    try{
        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json({
                status:"failed",
                message:"欄位未填寫正確"
            })
        }
        const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
        if(!passwordRule.test(req.body.password)){
            return res.status(400).json({
                status:"failed",
                message:"密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
            })
        }
        const existUser = await dataSource.getRepository('Users').findOneBy({ email: req.body.email });
        if(existUser){
            return res.status(409).json({
                status:"failed",
                message:"Email 已被使用"
            })
        }
        const hashPassword =  await bcrypt.hash(req.body.password, 10)
        const newUser = await dataSource.getRepository('Users').save({
            name:req.body.name,
            email:req.body.email,
            password:hashPassword
        });
        return res.status(200).json({
            status:"success",
            data:{
                user:{
                    id:newUser.id,
                    name:newUser.name
                }
            }
        })
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})

router.post('/login',async(req,res)=>{
    try{

        if(!req.body.email || !req.body.password){
            return res.status(400).json({
                status:"failed",
                message:"欄位未填寫正確"
            })
        }
        const checkemail = await dataSource.getRepository('Users').findOneBy({email:req.body.email})
        if(!checkemail){
            return res.status(400).json({
                status:"failed",
                message:"使用者不存在或密碼輸入錯誤"
            })
        }
        const isMatch = await bcrypt.compare(req.body.password, checkemail.password);
        if (!isMatch) {
            return res.status(400).json({ 
                status: "failed", 
                message: "使用者不存在或密碼輸入錯誤" 
            });
        }
        const token = jwt.sign(
            { id: checkemail.id, role: checkemail.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_DAY || '30d' }
        );
    
        return res.status(200).json({
            status: "success",
            data: {
                token,
                user: { name: checkemail.name }
            }
        });
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }

})

router.get('/profile',authMiddleware,async(req,res)=>{
    const user = await dataSource.getRepository('Users').findOneBy({id:req.user.id})
    res.status(200).json({
        status:"success",
        data:{
            user:{
                email:user.email,
                name:user.name
            }
        }
    })
})

router.put('/profile',authMiddleware,async(req,res)=>{
        await dataSource.getRepository('Users').update({ id: req.user.id }, { name: req.body.name });
        res.status(200).json({ status: 'success' });
})

router.put('/password',authMiddleware,async(req,res)=>{
        if(!req.body.password || !req.body.new_password || !req.body.confirm_new_password){
            return res.status(400).json({
                "status": "failed",
                "message": "欄位未填寫正確"
            })
        }
        const user = await dataSource.getRepository('Users').findOneBy({id:req.user.id})
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: "failed",
                message: "舊密碼輸入錯誤"
            });
        }
        const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
        if(!passwordRule.test(req.body.new_password)||  req.body.new_password !==  req.body.confirm_new_password){
            return res.status(400).json({
                status:"failed",
                message:"密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
            })
        }
        const hashNewPassword = await bcrypt.hash(req.body.new_password, 10);
        await dataSource.getRepository('Users').update({ id: req.user.id }, { password: hashNewPassword });
        res.status(200).json({ status: 'success',"data": null });
})

router.get('/credit-package', authMiddleware, async (req, res) => {
    try {
        const purchases = await dataSource.getRepository('CreditPackagePurchase').find({
            where: { user: { id: req.user.id } },
            relations: ['creditPackage'],
            order: { purchase_at: 'DESC' }
        });

        const data = purchases.map(p => ({
            name: p.creditPackage.name,
            purchased_credits: p.purchased_credits,
            price_paid: p.price_paid,
            purchase_at: p.purchase_at
        }));

        return res.status(200).json({ status: 'success', data });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

router.get('/courses', authMiddleware, async (req, res) => {
    try {
        const purchases = await dataSource.getRepository('CreditPackagePurchase').find({
            where: { user: { id: req.user.id } }
        });
        const totalCredits = purchases.reduce((sum, p) => sum + p.purchased_credits, 0);

        const bookings = await dataSource.getRepository('CourseBooking').find({
            where: { user: { id: req.user.id } },
            relations: ['course', 'course.user']
        });

        const activeCount = bookings.filter(b => b.cancelled_at === null).length;

        const courseBooking = bookings
            .map(b => ({
                course_id: b.course.id,
                name: b.course.name,
                start_at: b.course.start_at,
                end_at: b.course.end_at,
                meeting_url: b.course.meeting_url,
                coach_name: b.course.user.name,
                cancelled_at: b.cancelled_at
            }))
            .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

        return res.status(200).json({
            status: 'success',
            data: {
                credit_remain: totalCredits - activeCount,
                credit_usage: activeCount,
                course_booking: courseBooking
            }
        });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

module.exports = router