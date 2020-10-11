// Setting Environment
let program = require('commander');
program.option('-e [value]','environment');
program.parse(process.argv);
if(program.e){
    process.env.NODE_ENV=program.e;
}

//Packages including
let express = require('express');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/empmgmt',{useUnifiedTopology: true,useNewUrlParser: true}).then(()=>{
    console.log('DB connected successfully');
});
let cors = require('cors');


let config = require('config');
if(!config.get('jwtSecretkey')){
   console.error('Error jwt token not found');
   process.exit(1);
}

let app = express();
require('express-async-errors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let all = require('./router/all');
let auth = require('./router/auth');

app.use('/all',all);
app.use('/auth',auth);
app.use('/',all);
app.listen(3000,()=>{
    console.log('Listening on port 3000');
})