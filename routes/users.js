var express = require('express');
var router = express.Router();

var User = require('../schema/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/save_user', function(req, res, next) {

  console.log(req.body.first_name);
  console.log(req.body.last_name);
  console.log(req.body.email);


   var user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: req.body.password,
			role: "MANAGER"
    });

	user.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}

		// res.json({ message: 'User has been created !'});
		console.log("user created");

	});


  res.render('index', { title: 'Team Manager' });
});


module.exports = router;
