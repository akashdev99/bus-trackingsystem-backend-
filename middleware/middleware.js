let jwt = require('jsonwebtoken');
const db= require("../config/database");

//check if authenticated
const checkauth = (req,res,next) =>{
  if(!req.session.userID){
    res.redirect('/security/login')}
    else{
      var ref = db.ref("security/");
        ref.child(req.session.userID).once('value', function(snapshot) { 
            res.locals.user=snapshot.val();
            next()
        })
      
    }
  }

//check if authenticated
const admincheckauth = (req,res,next) =>{
  if(!req.session.userID){
    res.redirect('/security/login')}
    else{
      var ref = db.ref("security/");
        ref.child(req.session.userID).once('value', function(snapshot) {
            // res.locals.user=snapshot.val();
            var x=snapshot.val();
            if(x.posf=='chief'){
              res.locals.user=snapshot.val();
              next()
            }
            else{
              res.redirect('/security/dashboard')
            }
            
        })
      
    }
  }

//if authenticated redirect home
const redirectHome = (req,res,next) =>{
    if(req.session.userID){
      res.redirect('/security/dashboard')}
      else{
        next()
      }
    }


module.exports = {
  
  checkauth:checkauth,
  redirectHome:redirectHome,
  admincheckauth:admincheckauth
}

