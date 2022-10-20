const model = require('./model');
const {ApolloError} = require('apollo-server-express')
const {bankPostValidation, bankPutValidation, bankFindValidation} = require('../../utils/validate')

module.exports = {
    Query: {
        bank: async() => await model.GET()
    },
    Mutation: {
        delBank:async(_, {id}) => {
           await model.DEL(id)
           
            return "deleted"
        },
        postBank: async (_, body) =>{
            const {error, value} = bankPostValidation.validate(body);
            if(error){
                return new ApolloError('xatolik', error.message)
            }
            
            const {name, address, mortgage} = value;
            
            await model.POST(name, address, mortgage)
            return "ok"
        },
        putBank: async (_, body) =>{
            const {error, value} = bankPutValidation.validate(body);
            if(error){
                return new ApolloError(`Ma'lumotlar to'gri emas!`, error.message)
            }
            const bank = await model.GET_BY_ID(body.id);
            if(bank.length == 0){
                return new ApolloError('Bank topilmadi', "Bank id not found")
            }

            const {name, address, mortgage, id} = value;
            
            if(bank.length>0){
                await model.PUT(name || bank[0].name, address || bank[0].address, mortgage || JSON.stringify(bank[0].mortgage), id)
            }
            return "ok"
        },
        findBank: async (_, body) => {
            const {error, value} = bankFindValidation.validate(body);
            if(error){
                return new ApolloError(`Ma'lumotlar to'gri emas!`, error.message)
            }
            const {year, sum} = value;
            const banks = await model.GET();
            
            const find = () => {
                const result = []
                    const test = []
                    for(let i of banks){
                        for(let e=0; e <i.mortgage.length; e++){
                            test.push({sum: Math.abs(i.mortgage[e].sum - sum), index: e, id: i.id})
                        }
                    }
                    const find = test.sort((a,b) => a.sum - b.sum)[0]
                    result.push(banks.find(a => a.id == find.id))
                    result.filter(el => el.mortgage = el.mortgage[find.index]);
                    result[0].mortgage.permonth = (find.sum / (year*12)).toFixed()-0

                return result;
            } 
            return find();
        }
    }
}