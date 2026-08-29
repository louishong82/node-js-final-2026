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
})

router.delete('/skill/:id',async(req,res)=>{
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
})

module.exports = router