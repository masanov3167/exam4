const {sqlData} = require('../../utils/pg');
const uuid = require('uuid');
const path = require('path')

const imgUploader = req =>{
    if(req?.files?.pic){
        const pathImg = uuid.v4() + path.extname(req.files.pic.name);
        req.files.pic.mv(path.join(__dirname, '..','..','uploads', pathImg));
        return pathImg;
    }
    return false
}

class Media{
    async add (req, res) {
        try{
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga media joylash uchun ruhsat yo`q'});
                return
            }

            if(!req.files.pic){
                res.status(403).json({status:403, success:false, message:'Rasm yuklanishi shart'});
                return
            }
                        
            const file = await sqlData('insert into media(url, mimetype) values($1, $2) returning *', imgUploader(req), req.files.pic.mimetype.split('/')[0]);
        
            res.status(200).json({status:200, success: true, data: file[0],  message: 'Media joylandi!' })
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (req, res) {
        try{
            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga mediani ko`rish uchun ruhsat yo`q'});
                return
            }

            const medias = await sqlData('select * from media order by date desc');
        
            res.status(200).json({status:200,success: true, data: medias, totalCount: medias.length })
        }
        catch(err){
            console.log(err);
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{

            if(isNaN(req.params.id)){
                res.status(404).json({status:404, success: false, message:`Media id faqat raqam bo'lishi kerak`});
                return
            }

            const medias = await sqlData('select * from media where id = $1', req.params.id);

            if(medias.length==0){
                res.status(404).json({status:404, success: false, message:`media topilmadi`});
                return
            }
        
            res.status(200).json({status:200,success: true, data: medias[0]})
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

            if(req.user.role != 3 && req.user.role != 4){
                res.status(403).json({status:403, success:false, message:'Sizga mediani o`chirish uchun ruhsat yo`q'});
                return
            }

            const medias = await sqlData('select * from media where id = $1', req.params.id);

            if(medias.length==0){
                res.status(404).json({status:404, success: false, message:`media topilmadi`});
                return
            }

            const deletedMeida =await sqlData('delete from media where id = $1 returning *', req.params.id)
        
            res.status(200).json({status:200,success: true, data: deletedMeida[0]})
        }
        catch{
            res.status(500).json({status:500,success: false, message: 'invalid request'})
        }
    }
}

module.exports = new Media;
