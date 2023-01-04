const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const routes = require('./routes/routes');
const cors = require('cors')
const path = require('path')
const fileUpload = require('express-fileupload')

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname, 'uploads')
}));

app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(PORT, console.log(PORT))