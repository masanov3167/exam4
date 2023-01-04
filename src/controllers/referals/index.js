const {sqlData} = require('../../utils/pg');
const jwt = require('jsonwebtoken');
const validate = require('../../utils/validate');

const setToken = payload => jwt.sign(payload, 'MUSAFFO_SKY', {
    expiresIn:"1h"
})
class referalController{
    async add (req, res) {
        try{
            if(req.user.role !=4 && req.user.role !=3 && req.user.role !=2){
                res.status(403).json({status:403, success:false, message:'Sizga referal havola qo`shish uchun ruhsat yo`q'});
                return
            }

            const {error, value } = validate.postReferalValidation.validate({...req.body});

            if(error || value.title.length <2 || !value.product_id){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            const foundProduct = await sqlData('select * from products where id = $1', value.product_id);
            if(foundProduct.length==0){
                res.status(404).json({status:404, success: false, message:`${value.product_id} idli mahsulot topilmadi`});
                return;
            }
            
            const foundReferal = await sqlData('select * from referal where title = $1', value.title);
            if(foundReferal.length>0 && foundReferal[0].admin_id == req.user.id){
                res.status(403).json({status:403, success: false, message:`${req.body.title} nomli referal havola oldindan mavjud`});
                return;
            }
            
        const addReferal =  await sqlData('insert into referal(title, product_id, admin_id) values($1, $2, $3) returning *', value.title, value.product_id, req.user.id);
        
        res.status(200).json({status:200, success:true, data:addReferal[0], message: 'Yangi referal havola muvaffaqiyatli qo`shildi' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async edit (req, res) {
        try{
            if(req.user.role !=4 && req.user.role !=3 && req.user.role !=2){
                res.status(403).json({status:403, success:false, message:'Sizga referal havola qo`shish uchun ruhsat yo`q'});
                return
            }

            const oldData = await sqlData(`select * from referal where id = $1`, req.params.id-0);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'referal havola topilmadi'});
                return
            }

            if(oldData[0].admin_id != req.user.id){
                res.status(403).json({status:403, success: false, message: 'Faqat o`zingizga tegishli referal havolani tahrirlay olasiz'});
                return
            }
            
            const {error, value } = validate.postReferalValidation.validate({...req.body});
            if (error) {
                res.status(404).json({status:404, success: false, message: 'Ma`lumotlar xato to`ldirildi'});
                return
            }

            if(value.product_id){
                const foundProduct = await sqlData('select * from products where id = $1', value.product_id);
                if(foundProduct.length==0){
                    res.status(404).json({status:404, success: false, message:`${value.product_id} idli mahsulot topilmadi`});
                    return;
                }
            }

            const foundReferal = await sqlData('select * from referal where title = $1', value.title);
            if(foundReferal.length>0 && foundReferal[0].admin_id == req.user.id && foundReferal[0].id!=req.params.id-0){
                res.status(403).json({status:403, success: false, message:`${req.body.title} nomli referal havola oldindan avvaldan mavjud`});
                return;
            }

           const editedReferal =  await sqlData('update referal set title = $1, product_id = $2 where id = $3 returning *', value.title || oldData[0].title, value.product_id || oldData[0].product_id, req.params.id-0 );
            res.status(200).json({status:200, success:true, data: editedReferal[0], message: 'ma`lumotlaringiz yangilandi!' })
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async delete (req, res) {
        try{
            if(req.user.role !=4 && req.user.role !=3 && req.user.role !=2){
                res.status(403).json({status:403, success:false, message:'Sizga referal havola o`chirish uchun ruhsat yo`q'});
                return
            }

            const oldData = await sqlData(`select * from referal where id = $1`, req.params.id-0);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'referal havola topilmadi'});
                return
            }

            if(oldData[0].admin_id != req.user.id){
                res.status(403).json({status:403, success: false, message: 'Faqat o`zingizga tegishli referal havolani o`chira olasiz'});
                return
            }
            
            const deletedUser = await sqlData('delete from referal where id = $1 returning *', req.params.id-0);
            res.status(200).json({status:200, success:true, data:deletedUser[0], message: 'Muvaffaqiyatli o`chirildi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (req, res) {
        try{
            if(req.user.role !=4 && req.user.role !=3 && req.user.role !=2){
                res.status(403).json({status:403, success:false, message:'Sizga referal havolalarni ko`rish uchun ruhsat yo`q'});
                return
            }

            const oldData = await sqlData(`select * from referal order by date desc`);
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async getMyReferal (req, res) {
        try{
            if(req.user.role !=4 && req.user.role !=3 && req.user.role !=2){
                res.status(403).json({status:403, success:false, message:'Sizga referal havolalarni ko`rish uchun ruhsat yo`q'});
                return
            }

            const oldData = await sqlData(`select * from referal where admin_id = $1 order by date desc`, req.user.id -0);
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{
            const oldData = await sqlData(`select * from referal where id = $1`, req.params.id);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'Referal topilmadi'});
                return
            }
        
            res.status(200).json({status:200, success: true, data: oldData[0] })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }
}

module.exports = new referalController;