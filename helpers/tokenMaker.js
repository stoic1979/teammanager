//----------------------------------------------------------------
//   Helper script for making token
//----------------------------------------------------------------

var jsonwebtoken = require('jsonwebtoken');

var SECRET_KEY   = process.env.TEAM_MANAGER_SECRET_KEY;

var TokenMaker = function(){};


TokenMaker.prototype.createUserToken = function(user) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, SECRET_KEY, {
		expiresIn: '1h'
	});

	return token;
};

TokenMaker.prototype.createVerificationToken = function(user) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, SECRET_KEY, {
		expiresIn: '24h' // verification token will expire in 24 hours
	});

	return token;
};

module.exports = TokenMaker;
