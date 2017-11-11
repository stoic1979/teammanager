angular.module("issueService", [])

.factory('Issue', function($rootScope, $http, $q, AuthToken) {

    var issueFactory = {};


    issueFactory.create = function(issueData) {

    	console.log("issueService :: create, token: " + AuthToken.getToken());
    	console.log("issueData: " + JSON.stringify(issueData) );

        issueData.project = $rootScope.currentProject._id;

    	var payload = {
    			data: 	 issueData,
    			headers: {'x-access-token': AuthToken.getToken()}
    		}; 

    	return $http.post('/issues/add', payload);	
    };

    issueFactory.all = function() {

    	var payload = {
    			headers: {'x-access-token': AuthToken.getToken()}
    		};

    	return $http.get('/issues/all', payload);	
    };

    return issueFactory;
});