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

  Issue.find( {project: project_id}, function(err, issues) {

    if(err) {
      res.send(err);
      return;
    }
    res.json(issues);
  });
});

//-----------------------------------------------------------
//   ADD NEW ISSUE
//-----------------------------------------------------------
router.post('/add', function(req, res, next) {

  var user_id = req.decoded._id;

  logger.debug("save issue: user id=" + user_id);

  logger.debug("add issue got req with body: \n" + JSON.stringify(req.body) );

  logger.debug("add issue got req with data: \n" + JSON.stringify(req.body.data) );


  //fixme later !!!!!
  req.body.data.assignee = user_id;

   var issue = new Issue(
			req.body.data
    );


    if(req.body.start_date && req.body.start_date.length) {
    	issue.start_date = start_date;
    }

    if(req.body.end_date && req.body.end_date.length) {
    	issue.end_date = end_date;
    }

	issue.save(function(err) {
		if(err) {
			console.log("issue save error: " + err);
			res.send(err);
			return;
		}

		// res.json({ message: 'User has been created !'});
		console.log("issue created");
	});
  res.redirect('/');
});


module.exports = router;