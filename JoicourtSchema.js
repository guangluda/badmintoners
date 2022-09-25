const Joi = require('joi');

module.exports.courtSchema = Joi.object({
    court:Joi.object({
        title:Joi.string().required(),
        location:Joi.string().required(),
        website:Joi.string().required(),
        image:Joi.string().required(),
        description:Joi.string().required()
    }).required()
    })




module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        body:Joi.string().required()
    }).required()
})
