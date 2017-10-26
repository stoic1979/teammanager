//----------------------------------------------------------------
//   Script for testing token maker helper script
//----------------------------------------------------------------

const TokenMaker = require('../tokenMaker');

var tm = new TokenMaker();

// dummy user
var user = {
	_id: 'aabb1122',
	name: 'tommy',
	username: 'tommy'
};


var SECRET_KEY = "some strong secret key";
var token = tm.createUserToken(user);

console.log("Token: " + token);