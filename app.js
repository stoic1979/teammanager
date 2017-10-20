var bodyParser = require('body-parser');
var express    = require('express');
var exphbs     = require('express-handlebars');
var mongoose   = require('mongoose');
var path       = require('path');
var session    = require('express-session');
var jsonwebtoken = require('jsonwebtoken');

var index    = require('./routes/index');
var users    = require('./routes/users');
var projects = require('./routes/projects');
var tasks    = require('./routes/tasks');


const TEAM_MANAGER_MONGODB_URI = process.env.TEAM_MANAGER_MONGODB_URI;
const TEAM_MANAGER_PORT        = process.env.TEAM_MANAGER_PORT;
const SECRET_KEY               = process.env.TEAM_MANAGER_SECRET_KEY;


//----------------------------------------------------------------------------
//  SETUP APP
//----------------------------------------------------------------------------
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: "Your secret key"}));


//----------------------------------------------------------------------------
// adding routers
//----------------------------------------------------------------------------
app.use('/',         index);
app.use('/users',    users);
app.use('/projects', projects);
app.use('/tasks',    tasks);


//----------------------------------------------------------------------------
//   TOKEN VALIDATION
// 
//   This is middleware function with no mount path. 
//   The function is executed every time the app receives a request.
//----------------------------------------------------------------------------

app.use(function(req, res, next){

    console.log("[INFO] api.use() :: Got some request, validating token !");

    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    if(token) {

        jsonwebtoken.verify(token, SECRET_KEY, function(err, decoded){

            if(err) {
                //res.status(403).send({success: false, message: "Failed to authenticate user"});
                console.log("[ERROR] :: Failed to authenticate user");
            } else {
                req.decoded = decoded;
                //console.log("decoded: " + req.decoded);
                next();
            } 	
        });

    } else {
        res.status(403).send({success: false, message: "No token provided"});
    }
});//use


//----------------------------------------------------------------------------
//   CONNECT TO MONGODB
//----------------------------------------------------------------------------
mongoose.connect(TEAM_MANAGER_MONGODB_URI, function(err) {
    if(err) {
        console.log("[ERROR] failed to connect to database: " + err);
    } else {
        console.log("[INFO] Successfully connected to database. ");
    }
});


//----------------------------------------------------------------------------
//                    START SERVER 
//----------------------------------------------------------------------------
var server = app.listen(TEAM_MANAGER_PORT, function (err) {

    if(err) {
        console.log(err);
    } else {

        var host = server.address().address
            var port = server.address().port

            console.log("Team Manager sever listening at http://%s:%s", host, port)
    }
})
