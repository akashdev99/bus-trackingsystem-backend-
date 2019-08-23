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
  redirectHome:redirectHome
}

//https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e