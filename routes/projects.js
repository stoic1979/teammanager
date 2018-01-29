var express      = require('express');
var router       = express.Router();
const logger     = require('../helpers/logger');
var jsonwebtoken = require('jsonwebtoken');
const Mailer     = require('../helpers/mailer');
const TokenMaker = require('../helpers/tokenMaker');

var secretKey  = process.env.TEAM_MANAGER_SECRET_KEY;
var tokenMaker = new TokenMaker(secretKey);
var mailer     = new Mailer();

var Project         = require('../schema/project');
var User            = require('../schema/user');
var SelectedProject = require('../schema/selectedProject');




//-----------------------------------------------------
//   VERIFY
//-----------------------------------------------------
router.get('/verify/:token', function(req, res) {
    var token = req.params.token;

    console.log("Got verification token: " + token);

    if(!token) {
        res.send("No token found!");
        return;
    }

    jsonwebtoken.verify(token, secretKey, function(err, decoded){

        if(err) {
            res.send("Token verification failed!");
            return;
        }
        var _id=decoded._id;
        console.log("id -------------->" +_id);
        // approving user
        Project.update({_id: decoded.project}, {is_accepted: true}, function(err, numberAffected, rawResponse) {

            console.log("-- saved: " + err);

            if(err) res.send("Token verification failed!");

            else {

                var parentDir  = __dirname.substring(0, __dirname.lastIndexOf('/'));
                res.sendFile(parentDir + '/public/views/general/verification_done.html') ;
                }
            })
        });//jsonwebtoken
    });

// ----------------------------------------------------------
// send email to assigneee of issue
// ------------------------------------------------------------

function sendAssigneeEmail(req, manager, assignee, savedProject, token) {
    const subject = "Welcome to team manager";
    var html = "<b>Hi " + assignee.first_name + " " + assignee.last_name + " </b><br>";

    html += "<br> You are assigned a project "+ savedProject.title + " by " +manager+" ";

    html += "<br> Click on the  following link to accept your project ";

    // origin will tell localhost or server domain url's prefix
    var origin = req.get('origin');

     html += "<br><a href='" + origin + "/projects/verify/" + token + "'>ACCEPT</a>";

    html += "<br><br> Thanks <br> Team Manager Team";
    console.log("assignee email-----"+assignee.email);
    mailer.sendMail(assignee.email, subject, html);
}


router.post('/add', function(req, res, next) {
  if(!req.body.title || !req.body.description || !req.body.assignee || !req.body.estimated_hours || !req.body.start_date || !req.body.end_date){

      res.send({success:false ,message:'one or  more fields are  missing'});
      return;
  }
	var manager_id = req.decoded._id;
  var manager= req.decoded.first_name+" "+req.decoded.last_name;

   	var project = new Project({
			title			      : req.body.title,
			description 	  : req.body.description,
			manager			    : manager_id,
			assignee 		    : req.body.assignee,
			estimated_hours : req.body.estimated_hours,
     	start_date      : req.body.start_date,
     	end_date        : req.body.end_date,
    });

	project.save(function(err, savedProject) {
		if(err) {
			console.log("project save error: " + err);
			res.send(err);
			return;
		}

		var assignee_id = savedProject.assignee;
		var project_id  = savedProject._id;

		User.findOne({_id:assignee_id})
        .exec(function(err, assignee) {

          if(err) {
          // res.send(err);
            console.log('error while finding the assignee data '+err);
            return;
        	}

        	sendAssigneeEmail(req, manager, assignee, savedProject, tokenMaker.createProjectToken(assignee_id, project_id));
  			res.json({ success: true, message: 'Project created !', project: project});

		}); // find user(assignee)
    }); // save project
}); // add function

// ---------------------------------------------
// SAVE SELECTED PROJECT
// ---------------------------------------------------

router.post('/selectedProject', function(req, res, next){

  if(! req.body.project){
    res.send({success:false ,message:'project  fields is  empty'});
    return;
  }

  var selectedProject = new SelectedProject({
    project : req.body.project
  });

  selectedProject.save(function(err, savedSelectedProject) {
    if(err) {
      console.log("selectedProject save error: " + err);
      res.send(err);
      return;
    }
    console.log("selectedProject saved " +savedSelectedProject);
    res.json({ success: true, message: 'SelectedProject saved !', selectedProject: selectedProject});
  });// save selectedProject
});// post function

//-----------------------------------------------------------
//   GET PROJECT BY PROJECT ID
//-----------------------------------------------------------
router.get('/by_id/:id', function(req, res, next) {

  var project_id = req.params.id;
  console.log('get project by id '+project_id);
  Project.findOne( {_id: project_id} )
  .exec(function(err, project) {
      if(err) {
        res.send(err);
        console.log('get project by id  error '+err);
        return;
      }
    res.json(project);
    console.log('-------project '+project);
  });
});//project by id


//-----------------------------------------------------
//   Get Projects
//-----------------------------------------------------
router.get('/all', function(req, res) {

	var user_id = req.decoded._id;
	console.log("get all project for user: " + user_id);

	Project.find( {manager: user_id})
	.populate('manager', ['_id', 'first_name', 'last_name', 'email'])
	.exec(function(err, projects) {

		if(err) {
			res.send(err);
      console.log("get project error "+err);
			return;
		}
		res.json(projects);
	});
});


module.exports = router;


