var express      = require('express');
var router       = express.Router();
var jsonwebtoken = require('jsonwebtoken');
const Mailer     = require('../helpers/mailer');
const TokenMaker = require('../helpers/tokenMaker');


var secretKey = process.env.TEAM_MANAGER_SECRET_KEY;

var tokenMaker = new TokenMaker(secretKey);
var mailer     = new Mailer();

var User = require('../schema/user');
var Team = require('../schema/team');

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

router.post('/signup', function(req, res, next) {

   var user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			role: "MANAGER"
    });

    var token = tokenMaker.createUserToken(user);
	user.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}

		//------------------------
		// create team for user
		//------------------------
		var team = new Team({
			name: req.body.team_name,
			manager: user._id,
		});

		team.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ success: true, message: 'User has been created !', token: token});
			sendWelcomeEmail(user);
		});

	});

});

function sendWelcomeEmail(user) {
   const subject = "Welcome to team manager";
   const html = "<b>Hi " + user.username +  " </b>, <br> Welcome !!! <br> Team Manager is a perfect solution for managing your project and teams !!! <br> Thanks <br> Team Manager Team";

    mailer.sendMail(user.email, subject, html);
}


//-----------------------------------------------------
//   LOGIN
//-----------------------------------------------------
router.post('/login', function(req, res) {

	User.findOne({
		username: req.body.username
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
				 var token = tokenMaker.createUserToken(user);
				 //req.session.user = user;
				 //console.log("user logged in: " + user);
				 //res.redirect('/');

				 //FIXME - use it for REST APIS later !

				 console.log("login ok");
				 
				 res.json({
					success: true,
					message: "Successfully login !",
					token: token
				 });
				 
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

//-----------------------------------------------------
//   GET LOGGED IN USER INFO
//-----------------------------------------------------
router.get('/me', function(req, res){
	res.json(req.decoded);
});

module.exports = router;
