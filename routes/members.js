var express      = require('express');
var router       = express.Router();

var Member = require('../schema/member');




router.post('/add', function(req, res, next) {

	

   	var member = new Member({
			team: req.body.team,
			user: req.body.user,
			
    });

	member.save(function(err) {
		if(err) {
			console.log("member save error: " + err);
			res.send(err);
			return;
		}
		console.log("member created");
	});

  res.json({ success: true, message: 'member created !', member: member});
});

//-----------------------------------------------------
//   Get Members
//-----------------------------------------------------
router.get('/all', function(req, res) {

	var user_id = req.decoded._id;
	console.log("get all members for user: " + user_id);

	Member.find( {manager: user_id})
	.populate('manager', ['_id', 'first_name', 'last_name', 'username'])
	.exec(function(err, members) {

		if(err) {
			res.send(err);
			return;
		}
		res.json(members);
	});
});


module.exports = router;