let Joi = require('joi');
let mongoose = require('mongoose');

let loginValidate = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
});

function loginValidator(value){
    return loginstatus = loginValidate.validate(value);
}

module.exports = loginValidator;
