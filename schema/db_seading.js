//------------------------------------------------------------------------------
//   Script for seeding database with demo manager, team, project and assignee
//------------------------------------------------------------------------------


var mongoose = require('mongoose');

var User     = require('./user');
var Project  = require('./project');
var Team     = require('./team');


//--------------------------------------------------------
//   DUMMY DATA
//--------------------------------------------------------
var myteam = {
    name: "TM-PROJ-TEAM",
};

var auntpolly = {
    first_name: "Aunt",
    last_name: "Polly",
    username: "tmmanager",
    email: "tmmanager@gmail.com",
    password: "123",
    is_verified: true,
    role: "MANAGER"
};

var tomsawyer = {
    first_name: "Tom",
    last_name: "Sawyer",
    username: "tmworker",
    email: "tmworker@gmail.com",
    password: "123",
    is_verified: true,
    role: "WORKER"
};

var some_project = {
    title: "School Management Project",
    description: "School Management Project",
};


//-------------------------------------------
// Class for testing schema models
//-------------------------------------------
var SchemaSeading = function() {

    this.issues   = [];
    this.comments = [];

    // create user test
    this.createUser = function(data) {
        console.log("[SchemaSeading] :: creating user");

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

        console.log("[SchemaSeading] :: creating user");
        var project = new Project(data);
        project.save();

        return project;
    };

};//SchemaSeading


//---------------------------------------------
// function for seeding schema with demo data
//---------------------------------------------
function seadTheSchema() {

    var ST = new SchemaSeading();

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

}


//--------------------------------------------------------------------------
// connection string for test database for testing schema
// we will not use production database for this
//--------------------------------------------------------------------------
const TEAM_MANAGER_SEADING_MONGODB_URI = process.env.TEAM_MANAGER_SEADING_MONGODB_URI;

mongoose.connect(TEAM_MANAGER_SEADING_MONGODB_URI, function(err) {
    if(err) {
        console.log("[SchemaSeading] failed to connect to database: " + err);
        return;
    } 

    console.log("[SchemaSeading] Successfully connected to database. ");

    seadTheSchema();
});
