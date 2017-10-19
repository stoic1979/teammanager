var express      = require('express');
var router       = express.Router();

var Task = require('../schema/task');

router.get('/:id', function(req, res, next) {
  res.send('Task id:' + req.params.id);
});


router.post('/add', function(req, res, next) {


	console.log("save task: user id=" + req.session.user._id);

   var task = new Task({
			title: req.body.title,
			description: req.body.description,
			worker: req.body.worker,
			estimated_hours: req.body.estimated_hours,
    });


    if(req.body.start_date && req.body.start_date.length) {
    	task.start_date = start_date;
    }

    if(req.body.end_date && req.body.end_date.length) {
    	task.end_date = end_date;
    }

	task.save(function(err) {
		if(err) {
			console.log("task save error: " + err);
			res.send(err);
			return;
		}

		// res.json({ message: 'User has been created !'});
		console.log("task created");
	});
  res.redirect('/');
});


module.exports = router;