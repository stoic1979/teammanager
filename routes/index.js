var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

   var projects = [
     {
     	title: 'Project management portal',
     	_id: '7712343',
     },
     {
     	title: 'Unity 3D Game',
     	_id: '9812343',
     },

   ];
  res.render('home', { title: 'Team Manager', user: req.session.user, projects: projects });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Team Manager' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Team Manager' });
});


module.exports = router;
