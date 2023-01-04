const  joi = require('joi');

class Validate {
   postUserValidation = joi.object().keys({
        name: joi.string().min(3).messages({'string.base': `Ism text tipida kelsin`,'string.empty': `Ism bo'sh kelmasin`,'string.min': `Ism eng kamida {#limit} ta harfdan iborat bo'lsin`,'any.required': `Ism kiritilishi shart`}),
        login: joi.string().min(3),
        parol: joi.string().min(3),
        role: joi.number().valid(1,2,3,4),
        phone: joi.string().min(12).regex(/^[+]998[389][012345789][0-9]{7}$/), 
        tgId: joi.number().min(3)
    })

    loginValidation = joi.object().keys({
        login : joi.string().min(3).required(),
        parol: joi.string().min(3).required()
    })

    CategoryValidation = joi.object().keys({
        name_uz: joi.string().min(3),
        name_oz: joi.string().min(3),
        name_ru: joi.string().min(3),
        route: joi.string().invalid('aksiya').min(3).regex(/^[a-z][-a-z0-9]*$/i)
    })

    postProductValidation = joi.object().keys({
        name_uz: joi.string().min(3),
        name_oz: joi.string().min(3),
        name_ru: joi.string().min(3),
        body_uz: joi.string().min(3),
        body_oz: joi.string().min(3),
        body_ru: joi.string().min(3),
        price: joi.number().min(10000),
        money_for_seller: joi.number().min(1000),
        discount: joi.number(),
        category_id: joi.number(),
        isarchive: joi.boolean()
    })

    postNewsValidation = joi.object().keys({
        title_uz: joi.string().min(3),
        title_oz: joi.string().min(3),
        title_ru: joi.string().min(3),
        body_uz: joi.string().min(3),
        body_oz: joi.string().min(3),
        body_ru: joi.string().min(3)
    })

    postReferalValidation = joi.object().keys({
        title: joi.string().min(3),
        product_id: joi.number()
    })
}

module.exports = new Validate;