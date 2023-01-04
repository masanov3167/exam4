const {sqlData} = require('../../utils/pg');
const validate = require('../../utils/validate');

class News{
    async edit (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Yangilik id faqat raqam bo'lishi kerak`});
                return
            }
            
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga yangilikni tahrirlash uchun ruhsat yo`q'});
                return
            }
            
            const oldData = await sqlData('select * from news where id = $1', req.params.id - 0)
            
            if(oldData.length==0){
                res.status(404).json({status:404, success:false, message:'Yangilik topilmadi'});
                return
            }
            const { error, value } = validate.postNewsValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }
            
            const news = await sqlData(`update news set  title_uz =$1, title_oz =$2, title_ru =$3, body_uz = $4,  body_oz=$5 ,  body_ru =$6  where id = $7 returning *`,
             value.title_uz || oldData[0].title_uz , value.title_oz || oldData[0].title_oz , value.title_ru || oldData[0].title_ru,
              JSON.stringify(value.body_uz) || JSON.stringify(oldData[0].body_uz) , JSON.stringify(value.body_oz)|| JSON.stringify(oldData[0].body_oz) , JSON.stringify(value.body_ru)|| JSON.stringify(oldData[0].body_ru), req.params.id );

            res.status(200).json({status:200, success: true, data: news[0],  message: 'Yangilik yangilandi!' })
        }
        catch(e){
            console.log('err' +e);
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async add (req, res) {
        try{
            
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga yangilik joylash uchun ruhsat yo`q'});
                return
            }
            
            const { error, value } = validate.postNewsValidation.validate({...req.body}); 
            
            if(error || !value.title_uz || !value.title_oz || !value.title_ru || !value.body_uz || !value.body_oz || !value.body_ru){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }
            
           const news = await sqlData('insert into news(title_uz, title_oz, title_ru, body_uz , body_oz , body_ru) values($1, $2, $3, $4, $5, $6) returning *', value.title_uz , value.title_oz , value.title_ru, JSON.stringify(value.body_uz) , JSON.stringify(value.body_oz) , JSON.stringify(value.body_ru));
        
            res.status(200).json({status:200, success: true, data: news[0],  message: 'Yangilik qo`shildi!' })
        }
        catch(e){
            console.log('e' + e);
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (_, res) {
        try{
            const news = await sqlData('select * from news order by date desc');
        
            res.status(200).json({status:200,success: true, data: news, totalCount: news.length })
        }
        catch(e){
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{
            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Yangilik id faqat raqam bo'lishi kerak`});
                return
            }

            const news = await sqlData('select * from news where id = $1', req.params.id);

            if(news.length==0){
                res.status(404).json({status:404, success: false, message:`Yangilik topilmadi`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: news[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async delete (req, res) {
        try{

            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Yangilik id faqat raqam bo'lishi kerak`});
                return
            }

            if(req.user.role !=4 && req.user.role !=3){
                res.status(403).json({status:403, success:false, message:'Sizga Yangilik o`chirish uchun ruhsat yo`q'});
                return
            }

            const news = await sqlData('select * from news where id = $1', req.params.id);

            if(news.length==0){
                res.status(404).json({status:404, success: false, message:`Yangilik topilmadi`});
                return
            }

            const deletenew =await sqlData('delete from news where id = $1 returning *', req.params.id);
        
            res.status(200).json({status:200,success: true, message:`Yangilik o'chirildi`, data: deletenew[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }
}

module.exports = new News;
