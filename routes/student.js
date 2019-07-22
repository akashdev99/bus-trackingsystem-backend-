var express = require("express");
const jwt = require('jsonwebtoken');
var router  = express.Router();
const db= require("../config/database");
const middleware = require("../middleware/index");


//register
router.post("/signin",function(req,res){
    var name=req.body.name;
    var id=req.body.id;
    var dept=req.body.dept;
    var password=req.body.password;

//firebase wite
    var ref = db.ref("students/");
    ref.once("value")
    .then(function(snapshot){
        if(snapshot.hasChild(id)){
            res.json({"error":"userid exists"})
        }
        else{
            var newref=db.ref("students/"+id);
            newref.set ({   
           namef:name,
           idf: id,
           deptf: dept,
           passwordf:password
     });
            
        }
    })

});

//login
router.post('/login',function(req,res){

    var id=req.body.id;
    var password=req.body.password;
    //checking for user
    var ref = db.ref("students/");
    ref.child(id).once('value', function(snapshot) {
        // var exists = (snapshot.val() !== null);
        useref=snapshot.val();
        if (password==useref.passwordf){
            jwt.sign({useref},'dogs are cute',{expiresIn:'30s'},function(err,token){
                res.json({token});
            });
        }
      });
});

//protected route
router.get('/dashboard', middleware.verifyToken, (req, res) => {  
    jwt.verify(req.token, 'dogs are cute', function(err, authData){
      if(err) {
        res.sendStatus(403);
      } else {
        res.json({
          message: 'Post created...',
          authData
        });
      }
    });
  });

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }
  

module.exports = router;