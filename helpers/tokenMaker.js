//----------------------------------------------------------------
//   Helper script for making token
//----------------------------------------------------------------

var jsonwebtoken = require('jsonwebtoken');

var TokenMaker = function(){};


TokenMaker.prototype.createUserToken = function(user, secretKey) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: '1h'
	});

	return token;
};

TokenMaker.prototype.createVerificationToken = function(user, secretKey) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: '24h' // verification token will expire in 24 hours
	});

	return token;
};

module.exports = TokenMaker;
