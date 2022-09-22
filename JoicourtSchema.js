const Joi = require('joi');

const courtSchema = Joi.object({
    court:Joi.object({
        title:Joi.string().required(),
        location:Joi.string().required(),
        website:Joi.string().required(),
        image:Joi.string().required(),
        description:Joi.string().required()
    }).required()
})


module.exports = courtSchema;
