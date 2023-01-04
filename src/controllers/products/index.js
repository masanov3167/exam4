const {sqlData} = require('../../utils/pg');
const validate = require('../../utils/validate');
const removeMedia = require('../../utils/fs');
const path= require('path');
const uuid = require('uuid');

// const splitStr = str => str.toLowerCase().split('-').filter(e => e).join('-')

const imgUploader = req =>{
    if(req?.files?.avatar){
        const pathImg = uuid.v4() + path.extname(req.files.avatar.name);
        req.files.avatar.mv(path.join(__dirname, '..','..','uploads', pathImg));
        return pathImg;
    }
    return false
}

class Products{
    async edit (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Mahsulot id faqat raqam bo'lishi kerak`});
                return
            }
            
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga mahsulot tahrirlash uchun ruhsat yo`q'});
                return
            }
            
            const oldData = await sqlData('select * from products where id = $1', req.params.id - 0)
            
            if(oldData.length==0){
                res.status(404).json({status:404, success:false, message:'Mahsulot topilmadi'});
                return
            }
            const { error, value } = validate.postProductValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            if(req?.files?.avatar){
                removeMedia(oldData[0].pic)
            }
            
            const product = await sqlData(`update products set  name_uz =$1, name_oz =$2, name_ru =$3,
                body_uz = $4,  body_oz=$5 ,  body_ru =$6,
                  price =$7,  money_for_seller =$8,  discount =$9,
                  pic =$10,  category_id =$11,  admin_id =$12,
                  isarchive =$13 where id = $14 returning *`,
             value.name_uz || oldData[0].name_uz , value.name_oz || oldData[0].name_oz , value.name_ru || oldData[0].name_ru,
              JSON.stringify(value.body_uz) || JSON.stringify(oldData[0].body_uz) , JSON.stringify(value.body_oz)|| JSON.stringify(oldData[0].body_oz) , JSON.stringify(value.body_ru)|| JSON.stringify(oldData[0].body_ru) ,
               value.price|| oldData[0].price ,value.money_for_seller || oldData[0].money_for_seller, value.discount,
                imgUploader(req) || oldData[0].pic , value.category_id || oldData[0].category_id, oldData[0].admin_id,  value.isarchive || oldData[0].isarchive, req.params.id );

            res.status(200).json({status:200, success: true, data: product[0],  message: 'Mahsulot yangilandi!' })
        }
        catch(e){
            console.log('err' +e);
            res.status(500).json({status:500, message: 'invalid requcvcxvest'})
        }
    }

    async add (req, res) {
        try{
            
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga mahsulot joylash uchun ruhsat yo`q'});
                return
            }
            
            if(!req.files.avatar){
                res.status(403).json({status:403, success:false, message:'Mahsulot uchun rasm majburiy'});
                return
            }
            
            const { error, value } = validate.postProductValidation.validate({...req.body}); 
            
            if(error || !value.name_uz || !value.name_oz || !value.name_ru || !value.body_uz || !value.body_oz || !value.body_ru || !value.price || !value.category_id){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }
            
            const foundCategory = await sqlData('select * from category where id = $1', value.category_id - 0);
            
            if(foundCategory.length==0){
                removeMedia(req.file.filename)
                res.status(403).json({status:403, success: false, message:`category_id bo'yicha Kategoriya topilmadi`});
                return
            }
            
           const product = await sqlData('insert into products(name_uz, name_oz, name_ru, body_uz , body_oz , body_ru, price, money_for_seller, discount, pic, category_id, admin_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *', value.name_uz , value.name_oz , value.name_ru, JSON.stringify(value.body_uz) , JSON.stringify(value.body_oz) , JSON.stringify(value.body_ru) , value.price ,value.money_for_seller, value.discount , imgUploader(req) , value.category_id, req.user.id);
        
            res.status(200).json({status:200, success: true, data: product[0],  message: 'Mahsulot qo`shildi!' })
        }
        catch(e){
            console.log('e' + e);
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (_, res) {
        try{
            const products = await sqlData('select * from products order by date desc');
        
            res.status(200).json({status:200,success: true, data: products, totalCount: products.length })
        }
        catch(e){
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`product id faqat raqam bo'lishi kerak`});
                return
            }

            const product = await sqlData('select * from products where id = $1', req.params.id);

            if(product.length==0){
                res.status(404).json({status:404, success: false, message:`product topilmadi`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: product[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getByAdminId (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Admin id faqat raqam bo'lishi kerak`});
                return
            }

            const products = await sqlData('select * from product where admin_id = $1', req.user.id -0);

            if(products.length==0){
                res.status(404).json({status:404, success: false, message:`Siz hali mahsulot qo'shmagansiz`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: products})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async delete (req, res) {
        try{

            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Mahsulot id faqat raqam bo'lishi kerak`});
                return
            }

            if(req.user.role !=4 && req.user.role !=3){
                res.status(403).json({status:403, success:false, message:'Sizga mahsulot o`chirish uchun ruhsat yo`q'});
                return
            }

            const products = await sqlData('select * from products where id = $1', req.params.id);

            if(products.length==0){
                res.status(404).json({status:404, success: false, message:`Mahsulot topilmadi`});
                return
            }

            const deleteProduct =await sqlData('delete from products where id = $1 returning *', req.params.id);
            removeMedia(deleteProduct[0].pic)
        
            res.status(200).json({status:200,success: true, message:`Mahsulot o'chirildi`, data: deleteProduct[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }
}

module.exports = new Products;
