const express = require('express');
const app = express();
const bodyParser=require("body-parser");
const methodOverride = require("method-override");
const db= require("./config/database");


//requiring routes
var indexRoutes      = require("./routes/index");
var student      = require("./routes/student");
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


app.use("/ind", indexRoutes);
app.use("/student",student);



app.use((req,res,next) =>{
    const error =new Error('Not Found');
    error.status=404;
    next(error);
})  
// app.use((error,req,res,next) =>{
//     res.status(error.status || 500);
//     res.json({
//         error:{
//             message:error.message
//         }
//     })
// }) 
// var ref = db.ref("restricted_access/sec_document");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// var usersRef = ref.child("users");
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: "June 23, 1912",
//     full_name: "Alan Turing"
//   },
//   gracehop: {
//     date_of_birth: "December 9, 1906",
//     full_name: "Grace Hopper"
//   }
// });

app.listen(9000, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!");
 });