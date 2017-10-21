angular.module("projectService", [])

.factory('Project', function($http) {

    var projectFactory = {};


    projectFactory.create = function(projectData) {
    	return $http.post('/api', projectData);	
    };

    projectFactory.all = function() {
    	return $http.get('/api');	
    };



    return projectFactory;
});