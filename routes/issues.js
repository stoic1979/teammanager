const express    = require('express');
const router     = express.Router();
const logger     = require('../helpers/logger');
var jsonwebtoken = require('jsonwebtoken');
const Mailer     = require('../helpers/mailer');
const TokenMaker = require('../helpers/tokenMaker');

var secretKey  = process.env.TEAM_MANAGER_SECRET_KEY;
var tokenMaker = new TokenMaker(secretKey);
var mailer     = new Mailer();

var Issue         = require('../schema/issue');
var User          = require('../schema/user');
var Project       = require('../schema/project');
var SelectedIssue = require('../schema/selectedIssue');



//-----------------------------------------------------
//   Get Selected ISSUE
//-----------------------------------------------------
router.get('/selectedIssue', function(req, res) {
  console.log('------selectedIssue');
  SelectedIssue.find()
  .populate('issue')
  .exec(function(err, selectedIssue) {

    if(err) {
      res.send(err);
      console.log("get selected issue error "+err);
      return;
    }
    console.log("get selected issue  "+selectedIssue);
    res.json(selectedIssue);

  });
});

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
      console.log("get issues error "+err);
      res.send(err);
      return;
    }

    console.log('issues '+issues);
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

function sendAssigneeEmail(req, manager, project, assignee, savedIssue, token) {
    const subject = "Welcome to team manager";
    var html = "<b>Hi " + assignee.first_name + " " + assignee.last_name + " </b><br>";

    html += "<br> You are assigned a task to resolve the "+ savedIssue.summary + " "+ "issue in "+project.title +" project by " +manager+" ";

    html += "<br> Click on the  following link to accept your task ";

    // origin will tell localhost or server domain url's prefix
    var origin = req.get('origin');

     html += "<br><a href='" + origin + "/issues/verify/" + token + "'>ACCEPT</a>";

    html += "<br><br> Thanks <br> Team Manager Team";
    console.log("assignee email-----"+assignee.email);
    mailer.sendMail(assignee.email, subject, html);
}



//-----------------------------------------------------------
//   ADD NEW ISSUE
//-----------------------------------------------------------
router.post('/add', function(req, res, next) {

  if(!req.body.project || !req.body.summary|| !req.body.description || !req.body.type || !req.body.priority || !req.body.status || !req.body.estimated_hours || !req.body.start_date || !req.body.end_date){

      res.send({success:false ,message:'one or  more fields are  missing'});
      return;
  }

  var manager_id = req.decoded._id;
  var manager= req.decoded.first_name+" "+req.decoded.last_name;
  console.log("manager name----"+manager);
  console.log("start_date-"+req.body.start_date);

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
    var project_id  = savedIssue.project;
    var issue_id    = savedIssue._id;

    Project.findOne({_id:project_id})
      .exec(function(err, project) {

        if(err) {
          // res.send(err);
          console.log('error while finding the project data '+err);
          return;
        }

        User.findOne({_id:assignee_id})
        .exec(function(err, assignee) {

          if(err) {
          // res.send(err);
            console.log('error while finding the assignee data '+err);
            return;
        }

        sendAssigneeEmail(req, manager, project, assignee, savedIssue, tokenMaker.createIssueToken(assignee_id, issue_id));
        res.json({ message: 'Issue has been created !'});

      });// find assignee
    });// find project
  });// add issue
});//add




// ---------------------------------------------
// SAVE SELECTED ISSUE
// ---------------------------------------------------

router.post('/selectedIssue', function(req, res, next){

  // deleting the previosly saved selected project

  if(SelectedIssue && SelectedIssue.length){
    SelectedIssue.remove(function (err) {
      if(err){
        console.log("SelectedIssue remove error: "+err);
        res.send(err);
        return;
      }
    });
  }

  if(! req.body.issue){
    res.send({success:false ,message:'issue field is  empty'});
    return;
  }

  var selectedIssue = new SelectedIssue({
    issue : req.body.issue
  });

  selectedIssue.save(function(err, savedSelectedIssue) {
    if(err) {
      console.log("selectedIssue save error: " + err);
      res.send(err);
      return;
    }


    console.log("selectedIssue saved " +savedSelectedIssue);
    res.json({ success: true, message: 'SelectedProject saved !', selectedProject: savedSelectedIssue});
  });// save selectedIssue
});// post function




//-----------------------------------------------------------
//   EDIT ISSUE
//-----------------------------------------------------------
router.put('/edit/:id', function(req, res, next) {
  
  Issue.findOneAndUpdate({ _id: req.params.id }, req.body, (err,updatedIssue) => {
    if (err) { return console.error(err); }
    res.status(200).json({
        'success': true
    });
  });// findByIdAndUpdate
});//edit




module.exports = router;
