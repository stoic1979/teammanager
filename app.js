var bodyParser = require('body-parser');
var express    = require('express');
var exphbs     = require('express-handlebars');
var mongoose   = require('mongoose');
var path       = require('path');
var session    = require('express-session');

var index    = require('./routes/index');
var users    = require('./routes/users');
var projects = require('./routes/projects');

//-----------------------------------------------------
//  SETUP APP
//-----------------------------------------------------
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({secret: "Your secret key"}));


// adding routers
app.use('/', index);
app.use('/users', users);
app.use('/projects', projects);



const TEAM_MANAGER_MONGODB_URI = process.env.TEAM_MANAGER_MONGODB_URI;
const TEAM_MANAGER_PORT = process.env.TEAM_MANAGER_PORT;

//-----------------------------------------------------
//   CONNECT TO MONGODB
//-----------------------------------------------------
mongoose.connect(TEAM_MANAGER_MONGODB_URI, function(err) {
	if(err) {
		console.log("[ERROR] failed to connect to database: " + err);
	} else {
		console.log("[INFO] Successfully connected to database. ");
	}
});

//-----------------------------------------------------
//                    START SERVER 
//-----------------------------------------------------
var server = app.listen(TEAM_MANAGER_PORT, function (err) {
   
	if(err) {
		console.log(err);
	} else {

   		var host = server.address().address
   		var port = server.address().port
   
   		console.log("Example app listening at http://%s:%s", host, port)
	}
})