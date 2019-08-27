var express = require("express");
const jwt = require('jsonwebtoken');
var router  = express.Router();
const db= require("../config/database");
const middleware = require("../middleware/middleware");


router.get('/none',function(req,res){
  const {userId}=req.session;
  console.log(req.session);
})
//register
router.post("/signin",function(req,res){
    var name=req.body.name;
    var id=req.body.id;
    var pos=req.body.position;
    var password=req.body.password;
db.r
//firebase wite
    var ref = db.ref("security/");
    ref.once("value")
    .then(function(snapshot){
        if(snapshot.hasChild(id)){
            
            res.render("pages/register",{user:null});
        }
        else{
            var newref=db.ref("security/"+id);
            newref.set ({   
           namef:name,
           idf: id,
           posf: pos,
           passwordf:password
     }).then(res.render("pages/login",{user:null}));            
        }
    })

});

//render register
router.get('/signin',middleware.redirectHome,function(req,res){
  res.render('pages/register',{user:null});
})


//login
router.post('/login',function(req,res){

    var id=req.body.id;
    var password=req.body.password;
    //checking for user
    var ref = db.ref("security/");
    ref.child(id).once('value', function(snapshot) {
        // var exists = (snapshot.val() !== null);
        useref=snapshot.val();
        if(useref!=null)
        {if (password==useref.passwordf){
          
          // jwt.sign({useref},config.secret,{expiresIn:'360s'},function(err,token){  
          // });

          req.session.userID=id;
          return res.redirect('/security/dashboard');
      }else {
        console.log("fail");
        res.render("pages/login",{user:null});     
      }}
      else{
        console.log("server issue");
        res.render("pages/signin",{user:null}); 
      }
        
      });
});

//render login
router.get('/login',middleware.redirectHome,function(req,res){
  res.render('pages/login',{user:null});
});

router.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err){
      return res.redirect('/security/dashboard');
    }else{
      res.clearCookie('sid');
      return res.redirect('login');
    }
  })
});

router.get('/makebus',(req,res)=>{
  var ref = db.ref("buses/");
  var buses=["BUS-101","BUS-102"]
  buses.forEach((busid)=>{
    var newref=db.ref("buses/"+busid);
    newref.set ({   
    namef:"the cool bus",
    idf: busid,
    regionf: "chicken street",
    latf: "10.12",
    longf: "11.22",

  }).then(res.render("pages/login",{user:null}));
  })

   
})


//protected route
router.get('/dashboard', middleware.checkauth, (req, res) => {  
  var buses=[]
  const data=res.locals.user;
  var ref = db.ref("buses/");
  ref.once('value', function(snapshot){
    snapshot.forEach(function(_child){
        buses.push(_child.key);

        })
        data.bus=buses;
        console.log(data);
        res.render('pages/dashboard',{user:data});})
        
  // { idf: 'SEC16089',
  // namef: 'Akash',
  // passwordf: 'qwertyuiop',
  // posf: 'chief',
// buseS:["BUS101", }
  
  
  
  });


  

module.exports = router;