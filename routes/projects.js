var express      = require('express');
var router       = express.Router();

var Project = require('../schema/project');

router.get('/:id', function(req, res, next) {
  res.send('Project id:' + req.params.id);
});

module.exports = router;