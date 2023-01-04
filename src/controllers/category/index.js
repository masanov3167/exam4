const {sqlData} = require('../../utils/pg');
const validate = require('../../utils/validate');
const removeMedia = require('../../utils/fs');
const splitStr = str => str.toLowerCase().split('-').filter(e => e).join('-')

class Category{
    async add (req, res) {
        try{
            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga kategoriya qo`shish uchun ruhsat yo`q'});
                return
            }

            const { error, value } = validate.CategoryValidation.validate({...req.body}); 

            if(error || !value.name_uz || !value.name_oz || !value.name_ru || !value.route){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            const foundCategory = await sqlData('select * from category where route = $1', splitStr(value.route));

            if(foundCategory.length>0){
                res.status(403).json({status:403, success: false, message:`Bunaqa route avvaldan mavjud`});
                return
            }
            
           const addedCategory =  await sqlData('insert into category(name_uz, name_oz, name_ru, route) values($1, $2, $3, $4) returning *', value.name_uz, value.name_oz, value.name_ru, splitStr(value.route));
        
            res.status(200).json({status:200, success: true, data: addedCategory[0], message: 'Kategory qo`shildi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (_, res) {
        try{
            const categories = await sqlData('select * from category order by date desc');
        
            res.status(200).json({status:200,success: true, data: categories, totalCount: categories.length })
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{

            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Kategoriya id faqat raqam bo'lishi kerak`});
                return
            }

            const categories = await sqlData('select * from category where id = $1', req.params.id);

            if(categories.length==0){
                res.status(404).json({status:404, success: false, message:`Kategoriya topilmadi`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: categories[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getByRoute (req, res) {
        try{

            if(!req.params.route.match(/^[a-z][-a-z0-9]*$/i)){
                res.status(404).json({status:404, success: false, message:`Kategoriya route xato kiritildi`});
                return
            }

            const categories = await sqlData('select * from category where route = $1', req.params.route);

            if(categories.length==0){
                res.status(404).json({status:404, success: false, message:`Kategoriya topilmadi`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: categories[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async delete (req, res) {
        try{

            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Kategoriya id faqat raqam bo'lishi kerak`});
                return
            }

            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga kategoriya o`chirish uchun ruhsat yo`q'});
                return
            }

            const categories = await sqlData('select * from category where id = $1', req.params.id);

            if(categories.length==0){
                res.status(404).json({status:404, success: false, message:`Kategoriya topilmadi`});
                return
            }

                const products = await sqlData('select * from products where category_id = $1', req.params.id);
                if(products && products.length>0){
                    for(let i of products){
                        removeMedia(i.pic)
                    }
                }

            const deletedCategory =await sqlData('delete from category where id = $1 returning *', req.params.id);
        
            res.status(200).json({status:200,success: true, message:'Kategoriya o`chirildi',  data: deletedCategory[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async edit (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Kategoriya id faqat raqam bo'lishi kerak`});
                return
            }
            if(req.user.role !=4){
                res.status(403).json({status:403, success:false, message:'Sizga kategoriya tahrirlash uchun ruhsat yo`q'});
                return
            }

            const oldData = await sqlData('select * from category where id = $1', req.params.id - 0)

            if(oldData.length==0){
                res.status(404).json({status:404, success:false, message:'Kategoriya topilmadi'});
                return
            }

            const { error, value } = validate.CategoryValidation.validate({...req.body}); 

            if(error){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            if(value.route){
                const foundCategory = await sqlData('select * from category where route = $1', value.route.toLowerCase());
                if(foundCategory.length>0 && foundCategory[0].id != req.params.id -0){
                    res.status(403).json({status:403, success: false, message:`Bunaqa route avvaldan mavjud`});
                    return
                }
            }
            
            const updatedData = await sqlData('update category set name_uz = $1, name_oz = $2, name_ru = $3, route = $4 where id = $5 returning *', value.name_uz || oldData[0].name_uz, value.name_oz||oldData[0].name_oz, value.name_ru||oldData[0].name_ru, value.route ? value.route.toLowerCase() : oldData[0].route,   req.params.id-0 );
        
            res.status(200).json({status:200, success: true, message: 'Kategory yangilandi!', data: updatedData[0] })
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }
}

module.exports = new Category;
