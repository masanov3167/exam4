const {sqlData} = require('../../utils/pg');
const path = require('path');
const fs = require('fs')

class Company{
    async add (req, res) {
        try{
            const { name } = req.body; 
            
          const img = 'uploads/' + req.file['filename']
          await sqlData('insert into company(name, img) values($1, $2)', name, img);
        
        res.status(200).json({status:200, message: 'ma`lumotlaringiz yuklandi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }
    async edit (req, res) {
        try{
            const {id } = req.params;
            const oldData = await sqlData(`select * from company where id = $1`, id-0);

            if (oldData.length >0) {
                const oldImg = oldData[0].img.split('/')[1];
                fs.unlinkSync(path.join(__dirname,'..','..','uploads', oldImg))
                const { name } = req.body; 
                const img = 'uploads/' + req.file['filename'];
                await sqlData('update company set name = $1, img = $2 where id = $3', name || oldData[0].name, img, id);
            }
        
        res.status(200).json({status:200, message: 'ma`lumotlaringiz yangilandi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (_, res) {
        try{
            const oldData = await sqlData(`select * from company`);
        
        res.status(200).json({status:200, message: 'ma`lumotlaringiz yangilandi!', data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

}

module.exports = new Company;
