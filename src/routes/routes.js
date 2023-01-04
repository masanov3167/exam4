const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')
const uuid = require('uuid');
const middlewares = require('../middlewares');
const users = require('../controllers/users');
const category = require('../controllers/category');
const media = require('../controllers/media');
const products = require('../controllers/products');
const referals = require('../controllers/referals');
const news = require('../controllers/news');

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
     .get('/users',middlewares.checkContentType,  middlewares.checkToken, users.get)
     .get('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.getById)
     .delete('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.remove)
     .delete('/users',middlewares.checkContentType,  middlewares.checkToken, users.delete)
     .post('/admin',middlewares.checkContentType,  middlewares.checkToken, users.add)
     .post('/user_login', middlewares.checkContentType,  users.login)
     .put('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.edit)
     .post('/users', middlewares.checkContentType,middlewares.checkToken,  users.create)


     .post('/category',middlewares.checkContentType,  middlewares.checkToken,   category.add)
     .get('/category',middlewares.checkContentType,  category.get)
     .get('/category/:id',middlewares.checkContentType,middlewares.checkToken,   category.getById)
     .get('/category/get/:route',middlewares.checkContentType,    category.getByRoute)
     .delete('/category/:id',middlewares.checkContentType, middlewares.checkToken, category.delete)
     .put('/category/:id',middlewares.checkContentType,  middlewares.checkToken, category.edit)
     
     .post('/media', middlewares.checkToken, media.add)
     .get('/media', middlewares.checkContentType,  middlewares.checkToken,   media.get)
     .get('/media/:id', middlewares.checkContentType,  middlewares.checkToken,   media.getById)
     .delete('/media/:id', middlewares.checkContentType,  middlewares.checkToken,   media.delete)
     
     .post('/products', middlewares.checkToken, products.add)
     .put('/products/:id', middlewares.checkToken, products.edit )
     .delete('/products/:id', middlewares.checkToken, products.delete )
     .get('/products', middlewares.checkContentType,  products.get)
     .get('/products/:id', middlewares.checkContentType,  products.getById)
     .get('/myproducts', middlewares.checkContentType, middlewares.checkToken, products.getByAdminId)

     .post('/news', middlewares.checkContentType, middlewares.checkToken, news.add)
     .put('/news/:id',middlewares.checkContentType, middlewares.checkToken, news.edit )
     .delete('/news/:id',middlewares.checkContentType, middlewares.checkToken, news.delete )
     .get('/news', middlewares.checkContentType,  news.get)
     .get('/news/:id', middlewares.checkContentType,  news.getById)


     .post('/referal', middlewares.checkContentType, middlewares.checkToken, referals.add)
     .put('/referal/:id', middlewares.checkContentType, middlewares.checkToken, referals.edit)
     .delete('/referal/:id', middlewares.checkContentType, middlewares.checkToken, referals.delete)
     .get('/referal', middlewares.checkContentType, middlewares.checkToken, referals.get)
     .get('/referal/:id', middlewares.checkContentType, middlewares.checkToken, referals.getById)
     .get('/my-referal', middlewares.checkContentType, middlewares.checkToken, referals.getMyReferal)


     .get('/test', (req, res) => {
      console.log(req.ip)
      res.send(req.ip)
     })


module.exports = router;     