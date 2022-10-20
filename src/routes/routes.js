const express = require('express');
const router = express.Router();
const path = require('path')
const controller = require('../controllers/company/company');
const multer = require('multer')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads/'))
    }, 
    filename: function (req, file, cb) {
      if(file.originalname){
        cb(null, uuid.v4() + path.extname(file.originalname))
      }
    }
})

const upload = multer({ storage })

router
     .post('/company', upload.single('company-pic'),  controller.add)
     .put('/company/:id', upload.single('new-company-pic'),  controller.edit)
     .get('/company', controller.get)

module.exports = router;     