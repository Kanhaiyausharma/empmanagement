let bcrypt = require('bcrypt');

function passwordEncrypt(plntext,callback){
     bcrypt.genSalt(10).then((salt)=>{
       return bcrypt.hash(String(plntext),salt);
     }).then((hashtext)=>{
        callback(hashtext);
     })
}

 function passwordCompare(plantext,hashtext,callback){
     bcrypt.compare(String(plantext),hashtext,(err,stat)=>{
         if(err){callback(err);}else{
            callback(stat);
         }
     });
}


module.exports.passwordEncrypt = passwordEncrypt;
module.exports.passwordCompare = passwordCompare;