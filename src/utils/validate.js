const  joi = require('joi');

const complexPostValidation = joi.object().keys({
    name: joi.string().required(),
    address: joi.string().required(),
    room: joi.number().required(),
    roomkv: joi.number().min(30).required(),
    roomkvsum: joi.number().min(4000000).required(),
    companyid: joi.number().required()
});

const complexPutValidation = joi.object().keys({
    id: joi.number().required(),
    name: joi.string(),
    address: joi.string(),
    room: joi.number(),
    roomkv: joi.number().min(30),
    roomkvsum: joi.number().min(4000000),
    companyid: joi.number()
});

const bankPostValidation = joi.object().keys({
    name: joi.string().min(4).max(30).required(),
    address: joi.string().min(4).max(50).required(),
    mortgage: joi.string().required()
})

const bankPutValidation = joi.object().keys({
    name: joi.string().min(4).max(30),
    address: joi.string().min(4).max(50),
    mortgage: joi.string(),
    id: joi.number().required()
})

const bankFindValidation = joi.object().keys({
    year: joi.number().min(10).max(20).required(),
    sum: joi.number().required()
})

module.exports = {
    complexPostValidation,
    complexPutValidation,
    bankPostValidation,
    bankPutValidation,
    bankFindValidation
};