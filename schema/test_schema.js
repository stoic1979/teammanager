//----------------------------------------------------------------
//   Script for testing various models of the schema
//----------------------------------------------------------------

var mongoose = require('mongoose');
var Issue    = require('./issue');
var User     = require('./user');
var Project  = require('./project');


//--------------------------------------------------------
//   DUMMY DATA
//--------------------------------------------------------
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

var issue_fill_bucket = {
  summary: "Fill the bucket",
  description: "Fill the bucket with paint and whitewash the fence.",
  type: "TASK",
  priority: "HIGH",
  status: "WORKING",
  estimated_hours: 12
};


//-------------------------------------------
// Class for testing schema models
//-------------------------------------------
var SchemaTest = function() {

    this.issues = [];

    // create user test
    this.createUser = function(data) {
        console.log("[SchemaTest] :: creating user");

        var user = new User(data);

        user.save();

        return user;
    };

    // create project test
    this.createProject = function() {

        console.log("[SchemaTest] :: creating user");
        var project = new Project({
            title: "Whitewashing the fence",
            description: "Aunt Polly gives Tom the task of whitewashing the fence outside the house as punishment for his behavior the night before.",
            manager: this.manager._id,
        });
        project.save();
        return project;
    };

    // create issue test
    this.createIssue = function(data) {
        console.log("[SchemaTest] :: creating issue");
        var issue = new Issue(data);
        issue.save();
    };

};


function testSchema() {

    var ST = new SchemaTest();

    // creating team manager
    var manager = ST.createUser(auntpolly);
    ST.manager = manager;
    console.log("Added manager: " + JSON.stringify(manager));

    // creating a task assignee
    var assignee = ST.createUser(tomsawyer);
    ST.assignee = assignee;
    console.log("Added assignee: " + JSON.stringify(assignee));

    // creating a project
    var project = ST.createProject();
    ST.project = project;
    console.log("Added project: " + JSON.stringify(project));

    // creating issue - to fill bucket of paint
    var issue1 = JSON.parse(JSON.stringify(issue_fill_bucket));
    issue1.project = ST.project;
    issue1.assignee = ST.assignee;
    ST.createIssue(issue1);
    ST.issues.push(issue1);
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
