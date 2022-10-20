const model = require('./model');
const fs = require('fs');
const path = require('path');

module.exports = {
    Query: {
        company: async() => await model.GET()
    },
    Mutation: {
        delCompany:async(_, {id}) =>{
           const data = await model.GET_BY_ID(id);
           if(data.length >0){
               const img = data[0].img.split('/')[1];
               fs.unlinkSync(path.join(__dirname,'..','..','uploads', img))
            }
            await model.DEL(id)
            return "deleted"
        },
        getCompany: async(_, {id}) =>{
            const company = await model.GET_BY_ID(id);
            return company;
        }
    }
}