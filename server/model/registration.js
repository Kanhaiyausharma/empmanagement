let Joi = require('joi');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let config = require('config');
let _ = require('lodash');


let registrationSchema = new mongoose.Schema({
   firstname:{type:String,required:true},
   lastname:{type:String,required:true},
   username:{type:String,required:true,unique:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true},
   gender:{type:String,required:true},
   address:{type:String},
   role:{type:String,default:'user'},
   salary:{type:Number,required:true},
   department:{type:Array,required:true}
},{collection:'registration'}, { strict: false });

registrationSchema.methods.generateToken = function(opt){
    let pickval=_.pick(opt[0],['_id','username','firstname','role']);
    let dateNow = new Date();
    pickval.createdTime = dateNow.getTime();
    let jwtstring = jwt.sign(pickval,config.get('jwtSecretkey'));
    return jwtstring;
};

let registrationModel = mongoose.model('register',registrationSchema);


function registerValidate(regMeta){
   let registerValidatorSchema = Joi.object({
       firstname:Joi.string().required(),
       lastname:Joi.string().required(),
       username:Joi.string().required(),
       email:Joi.string().email().required(),
       gender:Joi.string().required(),
       address:Joi.string(),
       role:Joi.string().default('user'),
       salary:Joi.number().required(),
       department:Joi.array().required(),
       password:Joi.string().required(),
       confirmpassword: Joi.ref('password')
   }).with('password','confirmpassword');
  return registerValidatorSchema.validate(regMeta);
}


exports.registrationSchema = registrationSchema;
exports.registrationModel = registrationModel;
exports.registerValidate = registerValidate;

//module.exports = registrationModel;