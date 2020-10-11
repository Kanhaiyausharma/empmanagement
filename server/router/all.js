let express = require('express');
let registration = require('../model/registration');
let bcryptopt = require('../bcryptopt');
let _ = require('lodash');
let router = express.Router();
let auth = require('../middleware/auth');
let admin = require('../middleware/admin');




router.post('/registration',(request,response)=>{
    let validRvalue = registration.registerValidate(request.body);
    if(validRvalue.error){
        response.status(400).send(validRvalue.error.details[0].message);
    }else{
        bcryptopt.passwordEncrypt(request.body.password,(encpw)=>{
            request.body.password=encpw;
            //let pickVal =_.pick(request.body,['username','firstname','lastname','email','gender','department','salary','password']);
           registration.registrationModel.create(request.body,(err,result)=>{
            if(err){
                response.status(400).send('mongoError '+err.message);
            }else{
                let sendVal =_.pick(request.body,['username','firstname','lastname','email','gender','department','salary']);
                response.status(200).send(sendVal)
            }
          })
        })
        
    }
});

router.delete('/:id',[auth,admin],(request,response)=>{
    if(request.params.id){
        registration.registrationModel.deleteMany({_id:request.params.id},(err,res)=>{
            console.log(err);
            response.header('x-auth-token',request.header('x-auth-token')).send(res);
        })
    }
})

router.get('/',auth,(request,response)=>{
    console.log(request.user);
    registration.registrationModel.find({},null,(err,val)=>{
        response.send(val);
    })
});

router.get('/me',auth,(request,response)=>{
    registration.registrationModel.find({_id:request.user._id},null,(err,val)=>{
        response.send(val);
    }).select('-password');
})

module.exports = router;