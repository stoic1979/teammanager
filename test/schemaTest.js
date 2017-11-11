const mongoose = require('mongoose');
const assert   = require('chai').assert;

const User     = require('../schema/user');
const Issue    = require('../schema/issue');
const Project  = require('../schema/project');
const Team     = require('../schema/team');
const Comment  = require('../schema/comment');

const port     = process.env.PORT || process.env.TEAM_MANAGER_PORT;


//------------------------------------------------------------------
//
//                 DUMMY DATA
//
//------------------------------------------------------------------
var myteam = {
    name: "The Adventurous Team Of Tom Sawyer",
};

var auntpolly = {
    first_name: "Aunt",
    last_name: "Polly",
    username: "auntpolly",
    email: "auntpolly@gmail.com",
    password: "123",
    role: "MANAGER"
};

var tomsawyer = {
    first_name: "Tom",
    last_name: "Sawyer",
    username: "tomsawyer",
    email: "tomsawer@gmail.com",
    password: "123",
    role: "WORKER"
};

var some_project = {
    title: "Whitewashing the fence",
    description: "Aunt Polly gives Tom the task of whitewashing the fence outside the house as punishment for his behavior the night before.",
};

var issue_fill_bucket = {
  summary: "Fill the bucket",
  description: "Fill the bucket with paint and whitewash the fence.",
  type: "TASK",
  priority: "HIGH",
  status: "WORKING",
  estimated_hours: 12
};

var some_comment = {
  title: "Filling the bucket is boring",
  description: "Hey Aunt, its so boring task, pls assign me some playful task.",
};

//------------------------------------------------------------------
//
//                 CONNECTING TO MONGODB
//
//------------------------------------------------------------------
// this is uri for team manager's dev/test database
const TEAM_MANAGER_TEST_MONGODB_URI = process.env.TEAM_MANAGER_TEST_MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connection.openUri(TEAM_MANAGER_TEST_MONGODB_URI);  


//------------------------------------------------------------------
//
//                 TEST CASES FOR SCHEMA
//
//------------------------------------------------------------------
describe('Schema', function(){

  //-----------------
  // create manager
  //-----------------
  var manager = new User(auntpolly);
  it('Schema should create a user for project/team manager', function(){
    
        manager.save(function(err, user){
          assert.isNull(err, 'there was not error');
          assert.isEqual(auntpolly.username, user.username);
        });

  });
  
	//---------------------------------
	// manager should create a team
	//---------------------------------
  myteam.manager = manager;
  var team = new Team(myteam);
	it('Manager should create a team', function(){
		
        team.save(function(err, team){
        	assert.isNull(err, 'there was not error');
        	assert.isEqual(team.name, myteam.name);
        });

	});

  //-----------------
  // add new user 
  //-----------------
  var assignee = new User(tomsawyer);
  it('Schema should add new user', function(){
    
        assignee.save(function(err, user){
          assert.isNull(err, 'there was not error');
          assert.isEqual(tomsawyer.username, user.username);
        });

  });

  //-----------------
  // add new ptroject 
  //-----------------
  some_project.manager = manager;
  var project = new Project(some_project);
  it('Manager should add new project', function(){
    
        project.save(function(err, project){
          assert.isNull(err, 'there was not error');
          assert.isEqual(some_project.title, project.title);
        });

  });

  //--------------------------------------------------
  // add an issue to project and assign it to a user
  //--------------------------------------------------
  issue_fill_bucket.project = project;
  issue_fill_bucket.assignee = assignee;
  var issue = new Issue(issue_fill_bucket);
  it('Manager should add an issue to project and assign it to a user', function(){
    
        issue.save(function(err, issue){
          assert.isNull(err, 'there was not error');
          assert.isEqual(issue_fill_bucket.title, issue.summary);
        });

  });

  //--------------------------------------------------
  // assignee should make a comment on issue
  //--------------------------------------------------
  some_comment.writer = assignee;
  some_comment.issue  = issue;
  var comment = new Comment(some_comment);
  it('Assignee should make a comment on issue', function(){
    
        comment.save(function(err, comment){
          assert.isNull(err, 'there was not error');
          assert.isEqual(some_comment.title, comment.title);
        });

  });

});//describe-Schema

