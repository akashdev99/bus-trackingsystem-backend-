var express = require("express");
const jwt = require('jsonwebtoken');
var router  = express.Router();
const db= require("../config/database");

var mongoUtil = require( '../config/mongo' );

var dbs = mongoUtil.getDb();
const middleware = require("../middleware/middleware");


router.get('/none',function(req,res){
  const {userId}=req.session;
  console.log(req.session);
})


router.get('/mongo',function(req,res){
  dbs.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    dbs.close();
  });

});

//dummy data
router.get('/makebus',(req,res)=>{
  var ref = db.ref("buses/");
  var buses=["BUS-102","BUS-103","BUS-104","BUS-105","BUS-106","BUS-107"]
  buses.forEach((busid)=>{
    var newref=db.ref("buses/"+busid);
    newref.set ({   
    namef:"the cool bus",
    idf: busid,
    regionf: "Marthahalli ,Bengaluru ",
    latf: "12.8914774",
    longf: "77.6762883",

  }).then(res.render("pages/login",{user:null}));
  })

   
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
  var data=new Object();
  data.error=null;
  data.idf=null;
  res.render('pages/register',{user:data});
})


//login
router.post('/login',function(req,res){
    var id=req.body.id;
    var data=new Object();
    data.error=null;
    data.idf=null;
    var password=req.body.password;
    //checking for user
    var ref = db.ref("security/");
    //add error catch if user doesnt exist!!
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
        data.error="Sorry !! Your username or Password is wrong :( ,Please try again!"
        res.render("pages/login",{user:data});     
      }}
      else{
        console.log("server issue");
        data.error="Sorry !! Something is wrong on out end!"
        res.render("pages/signin",{user:data}); 
      }       
      });
});

//render login
router.get('/login',middleware.redirectHome,function(req,res){
  var data=new Object();
  data.error=null;
  data.idf=null;
  res.render('pages/login',{user:data});
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




//protected route
router.get('/dashboard', middleware.checkauth, (req, res) => {  
  var buses=[]
  var location=[]
  const data=res.locals.user;
  console.log(data);
  var ref = db.ref("buses/");
  ref.once('value', function(snapshot){
    snapshot.forEach(function(_child){
        buses.push(_child.key)
        location.push(_child.val().regionf);
        })
        data.bus=buses;
        data.location=location;
        res.render('pages/dashboard',{user:data});})

  });


//map
  router.get("/dashboard/:id",middleware.checkauth,(req,res)=>{
    id=req.params.id;
    var ref = db.ref("buses/"+id+"/");
    ref.once('value',(snapshot)=>{
      data=snapshot.val();
      res.render('pages/tracker',{user:data});
      })
    })


//analytics

router.get("/analytics", middleware.checkauth,(req,res)=>{
  var buses=[]
  var location=[]
  const data=res.locals.user;
  var ref = db.ref("buses/");
  ref.once('value', function(snapshot){
    snapshot.forEach(function(_child){
        buses.push(_child.key)
        location.push(_child.val().regionf);
        })
        data.bus=buses;
        data.location=location;
        res.render('pages/analytics',{user:data});})
  })

//analytics info
router.get("/analytics/:id",middleware.checkauth,(req,res)=>{
  id=req.params.id;
  var ref = db.ref("buses/"+id+"/");
  ref.once('value',(snapshot)=>{
    data=snapshot.val();
    res.render('pages/analytics',{user:data});
    })
  })

//Add messages
router.get("/makemessages",(req,res)=>{
  var buses=["BUS-101","BUS-102","BUS-103"]
  var priority=["low","high","low"]
  var message=["There is a huge traffic block,might take a bit of time","The tire has punctured ,please send someone!!!","Traffic Block"]
  var i=0;
  var date=new Date();
  buses.forEach((busid)=>{
    var newref=db.ref("messages/"+busid);
    newref.set ({   
    idf: busid,
    priority: priority[i],
    message: message[i],
    time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  }).then(i=i+1)})});



//messages

router.get("/messages", middleware.checkauth,(req,res)=>{
  var buses=[]
  var priority=[]
  var time=[]
  const data=res.locals.user;
  var ref = db.ref("messages/");
  ref.once('value', function(snapshot){
    snapshot.forEach(function(_child){
        buses.push(_child.key)
        priority.push(_child.val().priority);
        time.push(_child.val().time);
        })
        data.bus=buses;
        data.priority=priority;
        data.time=time;
        res.render('pages/message',{user:data});})
  //       { idf: 'SEC16089',
  // namef: 'gaithonde',
  // passwordf: 'qwertyuiop',
  // posf: 'chief',
  // bus: [ 'BUS-101', 'BUS-102', 'BUS-103' ],
  // priority: [ 'low', 'high', 'low' ],
  // time: [ '22:36:26', '22:36:26', '22:36:26' ] }
  });

//messages
router.get("/message/:id",middleware.checkauth,(req,res)=>{
  id=req.params.id;
  var ref = db.ref("messages/"+id+"/");
  ref.once('value',(snapshot)=>{
    data=snapshot.val();
    console.log(data);
    res.render('pages/convo',{user:data});
    })
  })

router.get("/close/:id",middleware.checkauth,(req,res)=>{
  console.log("here")
  id=req.params.id;
  var ref = db.ref("messages/");
  ref.child(id).remove().then(res.redirect('/security/dashboard'));
});






  



  

module.exports = router;