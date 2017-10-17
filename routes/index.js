var express = require('express');



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Team Manager' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Team Manager' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Team Manager' });
});


module.exports = router;
