const jwt = require('jsonwebtoken');
const { sqlData } = require('../utils/pg');

class middleware{
    async checkToken (req, res, next) {
        try{
            const { token } = req.headers; 
            if(!token){
                return res.status(401).json({status:401, success: false,token: false, message:'Token majburiy'})
            }
            
            jwt.verify(token, 'MUSAFFO_SKY', async (err,decode) =>{
                if(err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError){
                    return res.status(498).json({status:498, success: false, token: false, message:'Yaroqsiz token'})
                }
                
                const foundUser = await sqlData('select * from users where id = $1', decode.id);
                if(foundUser.length <1){
                    res.status(498).json({status:498, success: false, token: false, message:'Token bazada topilmadi :('});
                    return
                }
             
                req.user = foundUser[0]

                
                next();
            })
        }
        catch{
            res.status(500).json({status:500, success: false, token: false, message: 'invalid request'})
            return
        }
    }

    async checkContentType (req, res, next) {
        try{
            const contentType = () =>{
                return req.headers['content-type'] === 'application/json'
            }
            if(!contentType()){
                return res.status(500).json({status:500, success: false, message:'JSON tipida so`rov yuborilishi shart'})
            }   
            next();
        }
        catch{
            res.status(500).json({status:500, success: false, token: false, message: 'invalid request'})
            return
        }
    }
}

module.exports = new middleware;