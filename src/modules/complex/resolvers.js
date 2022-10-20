const model = require('./model');
const {ApolloError} = require('apollo-server-express')
const {complexPostValidation, complexPutValidation} = require('../../utils/validate')

module.exports = {
    Query: {
        complex: async() => await model.GET()
    },
    Mutation: {
        delComplex:async(_, {id}) => {
           await model.DEL(id)
           
            return "deleted"
        },
        postComplex: async (_, body) =>{
            const {error, value} = complexPostValidation.validate(body);
            if(error){
                return new ApolloError('xatolik', error.message)
            }
            const company = await model.GET_BY_COMPANY_ID(body.companyid);
            if(company.length == 0){
                return new ApolloError('xatolik', "Company id not found")
            }
            
            const {name, address, room, roomkv, roomkvsum, companyid} = value;
            
            await model.POST(name, address, room, roomkv, roomkvsum, companyid)
            return "ok"
        },
        putComplex: async (_, body) =>{
            const {error, value} = complexPutValidation.validate(body);
            if(error){
                return new ApolloError(`Ma'lumotlar to'gri emas!`, error.message)
            }
            const company = await model.GET_BY_COMPANY_ID(body.companyid);
            if(company.length == 0){
                return new ApolloError('Kompaniya idsi topilmadi', "Company id not found")
            }

            const {name, address, room, roomkv, roomkvsum, companyid, id} = value;
            const complex = await model.GET_BY_ID(body.id);            
            
            if(complex.length>0){
                await model.PUT(name, address, room, roomkv, roomkvsum, companyid, id)
            }
            return "ok"
        },
        getComplex: async(_, {id}) =>{
            const complex = await model.GET_BY_COMPANYID(id);
            return complex;
        },
        getOneComplex: async(_, {id}) =>{
            const complex = await model.GET_BY_ID(id);
            return complex;
        }
    }
}