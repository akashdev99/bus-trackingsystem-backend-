const express = require('express');
const app = express();
const bodyParser=require("body-parser");
const methodOverride = require("method-override");

const session = require('express-session')
const flash = require('express-flash-notification');
//to do flash notification
app.use(session({
    name:'sid',
    saveUninitialized:false,
    resave:false,
    secret:'its a secret,sorry',
    cookie:{
        maxAge: 3000000, //ms
        sameSite: true,
        secure: process.env.NODE_ENV === 'production' 
    }
}))



//requiring routes
app.use(flash(app));
var security     = require("./routes/security");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


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



app.use("/security",security);
app.get("*",(req,res)=>{
    var data=new Object();
    data.error=null;
    data.idf=null;
    res.render("pages/error",{user:data});
});


app.use((req,res,next) =>{
    const error =new Error('Not Found');
    error.status=404;
    next(error);
})  


app.listen(9000, process.env.IP, function(){
    console.log("The Bustracker Server Has Started!");
 });