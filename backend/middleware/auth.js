const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req , res , next){
    
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({status:'failed',message:'請先登入'})
    }
    
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token , SECRET);
        req.user = decoded
        next();
    }catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'failed', message: 'Token 已過期' });
        }
        return res.status(401).json({ status: 'failed', message: '無效的 token' });
    }
}

module.exports = authMiddleware