const {sqlData} = require('../../utils/pg');
const jwt = require('jsonwebtoken');
const validate = require('../../utils/validate');

const setToken = payload => jwt.sign(payload, 'MUSAFFO_SKY', {
    expiresIn:"1h"
})

class userController{
    async add (req, res) {
        try{
            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga user qo`shish uchun ruhsat yo`q'});
                return
            }
            const { error, value } = validate.postUserValidation.validate({...req.body}); 
            
            if(error || !value.name || !value.login || !value.parol || !value.role){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }
            
            const foundUser = await sqlData('select * from users where login = $1 or parol = $2', value.login, value.parol);
            if(foundUser.length>0){
                res.status(403).json({status:403, success: false, message:`login yoki parol avvaldan mavjud`});
                return;
            }

            if(value.phone){
                const foundUserByNumber = await sqlData('select * from users where phone = $1', value.phone);
                if(foundUserByNumber.length>0){
                    res.status(403).json({status:403, success: false, message:`Nomer avvaldan bazada mavjud`});
                    return;
                }
            }
            
        const addedUser =  await sqlData('insert into users(name, login, parol, role, phone) values($1, $2, $3, $4, $5) returning *', value.name, value.login, value.parol, value.role, value.phone);
        
        res.status(200).json({status:200, success:true, data:addedUser[0], message: 'Yangi user muvaffaqiyatli qo`shildi' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async create (req, res) {
        try{
            const { error, value } = validate.postUserValidation.validate({...req.body}); 

            if(error || !value.name || !value.login || !value.parol || !value.role){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            
            const foundUser = await sqlData('select * from users where login = $1 or parol = $2', value.login, value.parol);
            if(foundUser.length>0){
                res.status(403).json({status:403, success: false, message:`login yoki parol avvaldan mavjud`});
                return;
            }
            if(value.phone){
                const foundUserByNumber = await sqlData('select * from users where phone = $1', value.phone);
                if(foundUserByNumber.length>0){
                    res.status(403).json({status:403, success: false, message:`Nomer avvaldan bazada mavjud`});
                    return;
                }
            }
            
        const regUser =   await sqlData('insert into users(name, login, parol, role, phone, tgId) values($1, $2, $3, $4, $5, $6) returning *', value.name, value.login, value.parol, value.role, value.phone, value.tgId);
        
        res.status(200).json({status:200, success:true,role:regUser[0].role, token: setToken({id:regUser[0].id, role:regUser[0].role}),  message: 'muvaffaqiyatli ro`yhatdan o`tdingiz!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async login (req, res) {
        try{
            const { error, value } = validate.postUserValidation.validate({...req.body}); 
            if(error){
                res.status(401).json({status: 401, success: false, message:`Login yoki parol juda qisqa`});
                return
            }
            const foundUser = await sqlData('select * from users where login = $1 and parol = $2', value.login, value.parol);

            if(foundUser.length == 0){
                res.status(401).json({status: 401, success: false, message:`Login yoki parol no'tog'ri kiritildi`});
                return
            }
            res.status(200).json({status:200, success:true,role:foundUser[0].role, token: setToken({id:foundUser[0].id, role:foundUser[0].role}), message: 'muvaffaqiyatli profilga kirildi' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async edit (req, res) {
        try{
            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga user yangilash uchun ruhsat yo`q'});
                return
            }
            const {id } = req.params;
            const oldData = await sqlData(`select * from users where id = $1`, id-0);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'foydalanuvchi topilmadi'});
                return
            }
            
            const { error, value } = validate.postUserValidation.validate({...req.body});
            if (error) {
                res.status(404).json({status:404, success: false, message: 'Ma`lumotlar xato to`ldirildi'});
                return
            }

            if(value.phone){
                const foundUserByNumber = await sqlData('select * from users where phone = $1', value.phone);
                if(foundUserByNumber.length>0 && foundUserByNumber[0].id !=id){
                    res.status(403).json({status:403, success: false, message:`Nomer avvaldan bazada mavjud`});
                    return;
                }
            }

           const editedUser =  await sqlData('update users set name = $1, login = $2, parol = $3, role = $4, phone = $5, tgId = $6 where id = $7 returning *', value.name || oldData[0].name, value.login || oldData[0].login, value.parol || oldData[0].parol, value.role || oldData[0].role, value.phone || oldData[0].phone, value.tgId|| oldData[0].tgId,  id-0 );
            res.status(200).json({status:200, success:true, data: editedUser[0], message: 'ma`lumotlaringiz yangilandi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async delete (req, res) {
        try{
            const oldData = await sqlData(`select * from users where id = $1`, req.user.id-0);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'foydalanuvchi topilmadi'});
                return
            }
            
            const deletedUser = await sqlData('delete from users where id = $1 returning *', req.user.id-0);
            res.status(200).json({status:200, success:true, data:deletedUser[0], message: 'Muvaffaqiyatli o`chirildi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async remove (req, res) {
        try{
            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga userni o`chirish uchun ruhsat yo`q'});
                return
            }
            
            const foundUser = await sqlData('select * from users where id = $1', req.params.id);
            if(foundUser.length==0){
                res.status(404).json({status:404, success: false, message:`Foydalanuvchi topilmadi`});
                return;
            }
            
          await sqlData('delete from users where id = $1', req.params.id);
        
        res.status(200).json({status:200, success:true, message: 'User muvaffaqiyatli o`chirildi' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (_, res) {
        try{
            const oldData = await sqlData(`select * from users`);
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{
            const oldData = await sqlData(`select * from users where id = $1`, req.params.id);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'foydalanuvchi topilmadi'});
                return
            }
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

}

module.exports = new userController;
