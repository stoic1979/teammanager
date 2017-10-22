//----------------------------------------------------------------
//   Script for testing various models of the schema
//----------------------------------------------------------------


var mongoose = require('mongoose');


var Issue    = require('./issue');
var User     = require('./user');
var Project  = require('./project');
var Team     = require('./team');
var Comment  = require('./comment');


//--------------------------------------------------------
//   DUMMY DATA
//--------------------------------------------------------
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


//-------------------------------------------
// Class for testing schema models
//-------------------------------------------
var SchemaTest = function() {

    this.issues   = [];
    this.comments = [];

    // create user test
    this.createUser = function(data) {
        console.log("[SchemaTest] :: creating user");

        var user = new User(data);
        user.save();

        return user;
    };

    // create team test
    this.createTeam = function(data) {
        console.log("[createTeam] :: creating team");

        var team = new Team(data);
        team.save();

        return team;
    };

    // create project test
    this.createProject = function(data) {

        console.log("[SchemaTest] :: creating user");
        var project = new Project(data);
        project.save();

        return project;
    };

    // create issue test
    this.createIssue = function(data) {
        console.log("[SchemaTest] :: creating issue");
        var issue = new Issue(data);
        issue.save();

        return issue;
    };

    // add a comment to this task
    this.createComment = function(data) {
        console.log("[SchemaTest] :: creating comment");
        var comment = new Comment(data);
        comment.save();

        return comment;
    };
};//SchemaTest


//----------------------------------------
// function for executing all test cases
//----------------------------------------
function testSchema() {

    var ST = new SchemaTest();

    // creating  manager
    var manager = ST.createUser(auntpolly);
    ST.manager  = manager;
    console.log("Added manager: " + JSON.stringify(manager));

    // creating team
    var tData      = JSON.parse(JSON.stringify(myteam));
    tData.manager  = ST.manager;
    var team       = ST.createTeam(tData);
    ST.team        = team;
    console.log("Added team: " + JSON.stringify(team));

    // creating another user as assignee
    var assignee = ST.createUser(tomsawyer);
    ST.assignee  = assignee;
    console.log("Added assignee: " + JSON.stringify(assignee));

    // creating a project
    var pData     = JSON.parse(JSON.stringify(some_project));
    pData.manager = ST.manager._id
    var project   = ST.createProject(pData);
    ST.project    = project;
    console.log("Added project: " + JSON.stringify(project));

    // creating issue - to fill bucket of paint
    var issue1      = JSON.parse(JSON.stringify(issue_fill_bucket));
    issue1.project  = ST.project;
    issue1.assignee = ST.assignee;
    ST.createIssue(issue1);
    ST.issues.push(issue1);

    // adding comment to a task
    var comment1    = JSON.parse(JSON.stringify(some_comment));
    comment1.writer = ST.assignee;
    comment1.issue  = issue1._id;
    ST.createComment(comment1);
    ST.comments.push(comment1);
}


//--------------------------------------------------------------------------
// connection string for test database for testing schema
// we will not use production database for this
//--------------------------------------------------------------------------
const TEAM_MANAGER_TEST_MONGODB_URI = process.env.TEAM_MANAGER_TEST_MONGODB_URI;

mongoose.connect(TEAM_MANAGER_TEST_MONGODB_URI, function(err) {
    if(err) {
        console.log("[SchemaTest] failed to connect to database: " + err);
        return;
    } 

    console.log("[SchemaTest] Successfully connected to database. ");

    testSchema();
});
