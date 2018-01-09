const express  = require('express');
const router   = express.Router();
const logger   = require('../helpers/logger');


var Issue = require('../schema/issue');

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

  logger.debug("getting issue for project: " + project_id);

  Issue.find( {project: project_id} )
  .populate('assignee',['_id', 'first_name', 'last_name', 'email'])  // fieldname to be furhter looked-up
  .populate('project')   // fieldname to be furhter looked-up
  .exec(function(err, issues) {
      if(err) {
        res.send(err);
        return;
      }
    logger.debug("--- issues: " + JSON.stringify(issues));
    res.json(issues);
  });
});//all_by_project

//-----------------------------------------------------------
//   ADD NEW ISSUE
//-----------------------------------------------------------
router.post('/add', function(req, res, next) {

  if(!req.body.project || !req.body.summary|| !req.body.description || !req.body.type || !req.body.priority || !req.body.status || !req.body.estimated_hours || !req.body.start_date || !req.body.end_date){

      res.send({success:false ,message:'one or  more fields are  missing'});
      return;
  }
  if(req.body.assignee){
    var user_id=req.body.assignee;
  }
  else {
    user_id = req.decoded._id;
   }

  logger.debug("save issue: user id=" + user_id);

  logger.debug("add issue got req with body: \n" + JSON.stringify(req.body) );

  logger.debug("add issue got req with data: \n" + JSON.stringify(req.body.data) );


  //fixme later !!!!!
  // req.body.data.assignee = user_id;

   var issue = new Issue({
     project         : req.body.project,
     assignee        : user_id,
     summary         : req.body.summary,
     description     : req.body.description,
     type            : req.body.type,
     priority        : req.body.priority,
     status          : req.body.status,
     estimated_hours : req.body.estimated_hours,
     start_date      : req.body.start_date,
     end_date        : req.body.end_date,
    });


    // if(req.body.start_date && req.body.start_date.length) {
    // 	issue.start_date = start_date;
    // }
    //
    // if(req.body.end_date && req.body.end_date.length) {
    // 	issue.end_date = end_date;
    // }

	issue.save(function(err) {
		if(err) {
		  res.send(err);
      console.log("issue save error: " + err);
			return;
		}

		res.json({ message: 'Issue has been created !'});
		console.log("issue created");
	});
  // res.redirect('/');
});//add


module.exports = router;
