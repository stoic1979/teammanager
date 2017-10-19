var Project = require('../schema/project');
var Task = require('../schema/task');



function getUserProjects(req, data) {


  console.log("[INFO] ::  getUserProjects()");


  return new Promise(function(resolve, reject) {  //Promise 1: get projects 

    Project.find({manager: req.session.user._id}).exec().
    then(function(projects) {
      
      resolve(data);
    });

  }); //Promise 1: get projects 
}

function getProjectTasks(project_id) {

  console.log("[INFO] ::  getProjectTasks()");

  return new Promise(function(resolve, reject) {  //Promise 1: get tasks of current project 

    Task.find({project: project_id}).exec().
    then(function(tasks) {
      resolve(tasks);
    }).
    catch(function(err) {
         // no tasks added to this project or project no found
         console.log("[ERROR] :: getProjectTasks, err: " + err);
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


  // dummy tasks
  var tasks = [
     {
       title: 'fix bug 1',
       worker: 'tom'
     },
    {
       title: 'add feature 1',
       worker: 'marry'
     },

  ];

  data.tasks = tasks;

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
      return getProjectTasks(project_id);
  })
  .then(function(tasks){
      data.tasks = tasks;
      return data;
  })
}


module.exports = getUserData;
