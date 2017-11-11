const express  = require('express');
const router   = express.Router();
const logger   = require('../helpers/logger');


var Issue = require('../schema/issue');

router.get('/:id', function(req, res, next) {
  res.send('Issue id:' + req.params.id);
});


router.post('/add', function(req, res, next) {


   logger.debug("save issue: user id=" + req.session.user._id);

   logger.debug("add issue got req with body: \n" + JSON.stringify(req.body) );


   var issue = new Issue({
			title: req.body.title,
			description: req.body.description,
			assignee: req.body.assignee,
			estimated_hours: req.body.estimated_hours,
    });


    if(req.body.start_date && req.body.start_date.length) {
    	issue.start_date = start_date;
    }

    if(req.body.end_date && req.body.end_date.length) {
    	issue.end_date = end_date;
    }

    //FIXME: dont use hard-coded project
    issue.project = "59e622e36af4fb62d7286eab";

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