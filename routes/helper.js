var Project = require('../schema/project');
var Issue = require('../schema/issue');



function getUserProjects(req, data) {


  console.log("[INFO] ::  getUserProjects()");


  return new Promise(function(resolve, reject) {  //Promise 1: get projects 

    Project.find({manager: req.session.user._id}).exec().
    then(function(projects) {
      
      resolve(data);
    });

  }); //Promise 1: get projects 
}

function getProjectIssues(project_id) {

  console.log("[INFO] ::  getProjectIssues()");

  return new Promise(function(resolve, reject) {  //Promise 1: get tasks of current project 

    Issue.find({project: project_id}).exec().
    then(function(issues) {
      resolve(issues);
    }).
    catch(function(err) {
         // no issues added to this project or project no found
         console.log("[ERROR] :: getProjectIssues, err: " + err);
         resolve([]);
    });
  }); //Promise 1: get projects 
}


//-----------------------------------
// logged in user's specific data
// to be passed to the templates
//-----------------------------------
function getUserData(req) {

  var data = {};

  data.title = 'Team Manager';


  // dummy issues
  var issues = [
     {
       title: 'fix bug 1',
       worker: 'tom'
     },
    {
       title: 'add feature 1',
       worker: 'marry'
     },

  ];

  data.issues = issues;

  if(!req.session.user) {
    return new Promise(function(resolve, reject) {
      resolve(data);
    });
  }

  data.user = req.session.user;

  project_id = "59e622e36af4fb62d7286eab";

  return getUserProjects(req).
  then(function(projects){
      data.projects = projects;
      return getProjectIssues(project_id);
  })
  .then(function(issues){
      data.issues = issues;
      return data;
  })
}


module.exports = getUserData;
