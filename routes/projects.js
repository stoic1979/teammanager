var express      = require('express');
var router       = express.Router();

var Project = require('../schema/project');

router.get('/:id', function(req, res, next) {
  res.send('Project id:' + req.params.id);
});


router.post('/add', function(req, res, next) {


	console.log("save project: user id=" + req.session.user._id);

   var project = new Project({
			title: req.body.title,
			description: req.body.description,
			manager: req.session.user._id,
    });

	project.save(function(err) {
		if(err) {
			console.log("project save error: " + err);
			res.send(err);
			return;
		}

		// res.json({ message: 'User has been created !'});
		console.log("project created");
	});
  res.redirect('/');
});


module.exports = router;