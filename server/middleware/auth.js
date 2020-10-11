let config = require('config');
let jwt = require('jsonwebtoken');
function auth(req,res,next){
   const token = req.header('x-auth-token');
   if(!token){
     return  res.status(401).send('Access denied. No token provided');
   }
   try{
     let tokenDecode= jwt.verify(token,config.get('jwtSecretkey'));
     let currentdate = new Date();
     let currentDTTime = currentdate.getTime();
     if((currentDTTime-tokenDecode.createdTime)/1000 <3000){
      req.user=tokenDecode;
      next();
     }else{
       throw new console.error('Token expires');
     }
     
   }catch(err){
    res.status(400).send('Access denied. Token expires or Invalide token');
   }
   
}

module.exports = auth;