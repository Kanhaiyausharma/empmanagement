let express = require('express');
let loginvalidate = require('../model/login');
let {registrationModel} = require('../model/registration');
let bcryptopt = require('../bcryptopt');
let _ = require('lodash');
let jwt = require('jsonwebtoken');
let config = require('config');
let router = express.Router();
let mongoose = require('mongoose');



router.post('/login',(request,response)=>{
    let loginStatus=loginvalidate(request.body);
    if(loginStatus.error){
        response.status(400).send(loginStatus.error.details[0].message);
    }else{

      registrationModel.find(_.pick(request.body,['email']),null,(err,result)=>{
          console.log(result);
            if(err){response.status(400).send(err.message)}else{
                if(result.length<=0){
                    response.status(400).send('Email or Password is invalid');
                }else{
                    let pw =result[0].password;
                    bcryptopt.passwordCompare(request.body.password,pw,(statusres)=>{
                        if(statusres==true){
                             let regisModel = new registrationModel;
                             let jwtstring =  regisModel.generateToken(result);
                             response.status(200).send({token:jwtstring});
                        }else{
                            response.status(400).send('Email or Password is invalid');
                        }
                    })
                }
            } 
        });
    }
});

module.exports = router;