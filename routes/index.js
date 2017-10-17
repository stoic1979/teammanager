var express = require('express');

var router = express.Router();


var Project = require('../schema/project');


//-----------------------------------
// logged in user's specific data
// to be passed to the templates
//-----------------------------------
function getUserData(req) {

  var data = {};

  data.title = 'Team Manager';

  return new Promise(function(resolve, reject) {  //Promise 1: get projects 
    if(!req.session.user) {
      resolve(data);
    } 

    data.user = req.session.user;
    Project.find({manager: req.session.user._id}).exec().
    then(function(projects) {
      data.projects = projects;
      resolve(data);
    });

  }); //Promise 1: get projects 
}


/* GET home page. */
router.get('/', function(req, res, next) {
 
  getUserData(req)
  .then(function(data){
    res.render('home', data);
  })
  .catch(function(err){
    console.log("getUserData:: got error=" + err);
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Team Manager' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Team Manager' });
});


module.exports = router;
 