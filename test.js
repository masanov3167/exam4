const path = require('path');
const fs = require('fs');
const splitStr = str => str.split('-').filter(e => e).join('-')


const removeMedia = file => fs.existsSync(path.join(__dirname, 'src', 'uploads', file)) ? fs.unlinkSync(path.join(__dirname, 'src', 'uploads', file)) : false

