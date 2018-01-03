//----------------------------------------------------------------
//   Helper script for making token
//----------------------------------------------------------------

var jsonwebtoken = require('jsonwebtoken');

var TokenMaker = function(secretKey){
	this.secretKey = secretKey;
};


TokenMaker.prototype.createUserToken = function(user) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username,
		role: user.role
	}, this.secretKey, {
		expiresIn: '1h'
	});

	return token;
};

TokenMaker.prototype.createVerificationToken = function(user) {

	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, this.secretKey, {
		expiresIn: '24h' // verification token will expire in 24 hours
	});

	return token;
};

TokenMaker.prototype.createMembershipToken = function(member_id) {

	var token = jsonwebtoken.sign({
		_id: member_id,
	}, this.secretKey, {
		expiresIn: '24h' // verification token will expire in 24 hours
	});

	return token;
};

module.exports = TokenMaker;
