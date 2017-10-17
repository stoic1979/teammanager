var express      = require('express');
var router       = express.Router();
var jsonwebtoken = require('jsonwebtoken');
var secretKey    = process.env.TEAM_MANAGER_SECRET_KEY;

var User = require('../schema/user');

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

function checkSignIn(req, res){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {

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
	//}).select('password').exec(function(err, user) { // this will only select _id and password in user obj
	}).exec(function(err, user) {	//// this will select all fields in user obj

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
				 req.session.user = user;
				 console.log("user logged in: " + user);
				 res.redirect('/');

				 //FIXME - use it for REST APIS later !
				 /*
				 res.json({
					success: true,
					message: "Successfully login !",
					token: token
				 });
				 */
			}
		}
	});
});

//-----------------------------------------------------
//   LOGOUT
//-----------------------------------------------------
router.get('/logout', function(req, res) {
	req.session.destroy(function() {
      	console.log("user logged out")
   	});
   	res.redirect('/');
});//logout

module.exports = router;