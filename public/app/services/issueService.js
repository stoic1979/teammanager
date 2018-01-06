angular.module("issueService", [])

.factory('Issue', function($rootScope, $http, $q, AuthToken) {

    var issueFactory = {};


    issueFactory.create = function(issueData) {

    	console.log("issueService :: create, token: " + AuthToken.getToken());
    	console.log("issueData: " + JSON.stringify(issueData) );

        issueData.project = $rootScope.currentProject._id;

    	var payload = {
    			project         : ssueData.project,
                assignee        : issueData.assignee,
                summary         : issueData.summary,
                description     : issueData.description,
                type            : issueData.type,
                priority        : issueData.priority,
                status          : issueData.status,
                estimated_hours : issueData.estimated_hours,
                start_date      : issueData.start_date,
                end_date        : issueData.end_date,
    			headers: {'x-access-token': AuthToken.getToken()}
    		}; 

    	return $http.post('/issues/add', payload);	
    };

    issueFactory.getIssuesForCurrentProject = function(project_id) {

        var payload = {
                headers: {'x-access-token': AuthToken.getToken()}
            };

        return $http.get('/issues/all_by_project/' + project_id, payload);   
    };



    issueFactory.all = function() {

    	var payload = {
    			headers: {'x-access-token': AuthToken.getToken()}
    		};

    	return $http.get('/issues/all', payload);	
    };

    return issueFactory;
});