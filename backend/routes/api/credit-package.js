const express = require('express');
const router = express.Router();
const {dataSource} = require('../../db/data-source')
const authMiddleware = require('../../middleware/auth');

router.get('/',async(req,res)=>{
    const creditPackage = await dataSource.getRepository('CreditPackage').find()
    res.status(200).json({
        status:"success",
        data:creditPackage
    })
})

router.post('/',async(req,res)=>{
    try{

        if(!req.body.name ||!req.body.name.trim() || !req.body.credit_amount || !req.body.price){
            return res.status(400).json({
                 "status": "failed",
                "message": "欄位未填寫正確"
            })
        }
        if( typeof(req.body.name) !== 'string' ||
            typeof(req.body.credit_amount) !== 'number'  || 
            typeof(req.body.price) !== 'number' || 
            req.body.credit_amount <0 || 
            req.body.price <0 ||
            !Number.isInteger(req.body.credit_amount) || 
            !Number.isInteger(req.body.price)
        ){
            return res.status(400).json({
                "status": "failed",
                "message": "欄位未填寫正確"
            })
        }   
        const cheackname = await dataSource.getRepository('CreditPackage').findOneBy({name:req.body.name}) 
        if(cheackname){
            return res.status(409).json({
                status:"failed",
                message:"資料重複"
            })
        }
        const newCP = await dataSource.getRepository('CreditPackage').save({
            name:req.body.name,
            credit_amount:req.body.credit_amount,
            price:req.body.price
        })
        return res.status(200).json({
            status:'success',
            data:newCP
        })
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})
router.post('/:id', authMiddleware, async (req, res) => {
    try {
        const pkg = await dataSource.getRepository('CreditPackage').findOneBy({ id: req.params.id });
        if (!pkg) {
            return res.status(400).json({ status: 'failed', message: 'ID錯誤' });
        }

        await dataSource.getRepository('CreditPackagePurchase').save({
            purchased_credits: pkg.credit_amount,
            price_paid: pkg.price,
            user: { id: req.user.id },
            creditPackage: { id: pkg.id }
        });

        return res.status(200).json({ status: 'success', data: null });
    } catch (err) {
        return res.status(400).json({ status: 'failed', message: err.message });
    }
});

router.delete('/:id',async(req,res)=>{
    try{
        const CP = await  dataSource.getRepository('CreditPackage').findOneBy({id:req.params.id})
        if(!CP){
            return res.status(400).json({
                status:"failed",
                message:"ID錯誤"
            })
        }
        await dataSource.getRepository('CreditPackage').delete(CP)
        return res.status(200).json({
            status:"success",
            message:"刪除成功"
        })
    }catch(err){
        return res.status(400).json({ status: 'failed', message: err.message })
    }
})

module.exports =router