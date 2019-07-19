const express = require('express');
const app = express();
const morgan =require("morgan")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const trialroute=require("./api/routes/trial1");
//log display in temrinal
app.use(morgan('dev'));
//database connection
mongoose.connect("mongodb+srv://akash:7esv9j5hekagy22@cluster0-utja1.mongodb.net/test?retryWrites=true&w=majority",
{useMongoClient:true});


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//prevent cors errors
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authhorization");
    if (req.method==="OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }next();
})


app.use("/trial",trialroute);

app.use((req,res,next) =>{
    const error =new Error('Not Found');
    error.status=404;
    next(error);
})  
app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
}) 


module.exports = app;