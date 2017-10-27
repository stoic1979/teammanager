angular.module("projectService", [])

.factory('Project', function($http, $q, AuthToken) {

    var projectFactory = {};


    projectFactory.create = function(projectData) {

    	console.log("projectService :: create, token: " + AuthToken.getToken());
    	console.log("projectData: " + JSON.stringify(projectData) );

    	var payload = {
    			title: 			projectData.title,
    			description: 	projectData.description,
    			headers: 		{'x-access-token': AuthToken.getToken()}
    		}; 

    	return $http.post('/projects/add', payload);	
    };

    projectFactory.all = function() {
    	return $http.get('/api');	
    };

    return projectFactory;
});