const express    = require('express');
const router     = express.Router();
const logger     = require('../helpers/logger');
var jsonwebtoken = require('jsonwebtoken');
const Mailer     = require('../helpers/mailer');
const TokenMaker = require('../helpers/tokenMaker');

var secretKey  = process.env.TEAM_MANAGER_SECRET_KEY;
var tokenMaker = new TokenMaker(secretKey);
var mailer     = new Mailer();

var Issue = require('../schema/issue');
var User  = require('../schema/user');
//-----------------------------------------------------------
//   GET ISSUES BY ISSUE ID
//-----------------------------------------------------------
router.get('/:id', function(req, res, next) {
  res.send('Issue id:' + req.params.id);
});

//-----------------------------------------------------------
//   GET ALL ISSUES FOR PROJECT ID
//-----------------------------------------------------------
router.get('/all_by_project/:id', function(req, res, next) {

  var project_id = req.params.id;

  Issue.find( {project: project_id} )
  .populate('assignee',['_id', 'first_name', 'last_name', 'email'])  // fieldname to be furhter looked-up
  .populate('project')   // fieldname to be furhter looked-up
  .exec(function(err, issues) {
      if(err) {
        res.send(err);
        return;
      }
    res.json(issues);
  });
});//all_by_project

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
        Issue.update({_id: decoded.issue}, {is_accepted: true}, function(err, numberAffected, rawResponse) {

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

function sendAssigneeEmail(req, user, savedIssue, token) {
    const subject = "Welcome to team manager";
    var html = "<b>Hi " + user.first_name + " " + user.last_name + "   </b><br>, <br> Welcome !!! <br> Team Manager is a perfect solution for managing your project and teams !!! <br>";

    html += "<br> You are assigned a task to resolve the "+ savedIssue.summary + " ";

    html += "<br> Click on following link to accept your task ";

    // origin will tell localhost or server domain url's prefix
    var origin = req.get('origin');

     html += "<br><a href='" + origin + "/issues/verify/" + token + "'>VERIFY ME</a>";

    html += "<br><br> Thanks <br> Team Manager Team";
    console.log("user email-----"+user.email);
    mailer.sendMail(user.email, subject, html);
}


//-----------------------------------------------------------
//   ADD NEW ISSUE
//-----------------------------------------------------------
router.post('/add', function(req, res, next) {

  if(!req.body.project || !req.body.summary|| !req.body.description || !req.body.type || !req.body.priority || !req.body.status || !req.body.estimated_hours || !req.body.start_date || !req.body.end_date){

      res.send({success:false ,message:'one or  more fields are  missing'});
      return;
  }

  var issue = new Issue({
     project         : req.body.project,
     assignee        : req.body.assignee,
     summary         : req.body.summary,
     description     : req.body.description,
     type            : req.body.type,
     priority        : req.body.priority,
     status          : req.body.status,
     estimated_hours : req.body.estimated_hours,
     start_date      : req.body.start_date,
     end_date        : req.body.end_date,
    });


  issue.save(function(err, savedIssue) {
		if(err) {
		  res.send(err);
      console.log("issue save error: " + err);
			return;
		}

    var assignee_id = savedIssue.assignee;
    var issue_id    = savedIssue._id;
    User.findOne({_id:assignee_id})
    .exec(function(err, user) {

        if(err) {
            // res.send(err);
            console.log('error while finding the assignee data '+err);
            return;
        }
        
        sendAssigneeEmail(req, user, savedIssue, tokenMaker.createAssigneeToken(assignee_id, issue_id));
        res.json({ message: 'Issue has been created !'});

    });

  });

});//add

module.exports = router;
