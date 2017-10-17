var express = require('express');
var router = express.Router();

var User = require('../schema/user');

var jsonwebtoken = require('jsonwebtoken');


var secretKey = process.env.TEAM_MANAGER_SECRET_KEY;

function createToken(user) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: '1h'
	});

	return token;
}



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {

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


  res.render('home', { title: 'Team Manager' });
});


//-----------------------------------------------------
	//   LOGIN
	//-----------------------------------------------------
	router.post('/login', function(req, res) {

		User.findOne({
			email: req.body.email
		}).select('password').exec(function(err, user) {

			if(err) throw err;


			if(!user) {
				res.send({ message: 'User does not exist !'});
			} else if(user) {
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.json({ message: 'Invalid Password !'});
				} else {
					// login ok
					// create token
					 var token = createToken(user);

					 res.json({
						success: true,
						message: "Successfully login !",
						token: token
					 });
				}
			}

		});

	});


module.exports = router;
