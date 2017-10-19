var Project = require('../schema/project');




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

  return new Promise(function(resolve, reject) {  //Promise 1: get projects 
    if(!req.session.user) {
      resolve(data);
    } 

    data.user = req.session.user;
    Project.find({manager: req.session.user._id}).exec().
    then(function(projects) {
      data.projects = projects;
      resolve(data);
    });

  }); //Promise 1: get projects 
}


module.exports = getUserData;
