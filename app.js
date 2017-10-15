var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

//-----------------------------------------------------
//  SETUP APP
//-----------------------------------------------------
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//-----------------------------------------------------
//   CONNECT TO MONGODB
//-----------------------------------------------------
mongoose.connect(config.database, function(err) {
	if(err) {
		console.log("[ERROR] failed to connect to database: " + err);
	} else {
		console.log("[INFO] Successfully connected to database. ");
	}
});

